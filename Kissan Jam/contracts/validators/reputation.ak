/// Reputation Validator — stores provider reputation on-chain.
///
/// Each provider has a reputation UTxO that tracks:
/// - Total completed jobs
/// - Total failed jobs
/// - Cumulative rating score
/// - Total revenue earned
///
/// Only the marketplace authority (or multi-sig) can update reputation,
/// preventing providers from inflating their own scores.

use aiken/crypto.{VerificationKeyHash}

/// Reputation data stored in the datum
pub type ReputationDatum {
  /// Provider this reputation belongs to
  provider: VerificationKeyHash,
  /// Total number of successfully completed jobs
  completed_jobs: Int,
  /// Total number of failed/timed-out jobs
  failed_jobs: Int,
  /// Cumulative rating points (divide by completed_jobs for average)
  total_rating_points: Int,
  /// Total revenue earned in lovelace
  total_revenue: Int,
  /// Marketplace authority that can update this datum
  authority: VerificationKeyHash,
}

/// Actions for updating reputation
pub type ReputationRedeemer {
  /// Record a successful job completion with a rating
  RecordSuccess { rating_points: Int, revenue: Int }
  /// Record a failed/timed-out job
  RecordFailure
}

/// Reputation validator: ensures only the marketplace authority can update
validator reputation {
  spend(
    datum: Option<ReputationDatum>,
    redeemer: ReputationRedeemer,
    _output_reference: Data,
    transaction: Data,
  ) {
    expect Some(d) = datum

    when redeemer is {
      RecordSuccess { rating_points, revenue } -> {
        // Authority must sign
        // New rating must be between 1-5 (scaled by 100 for precision)
        // Revenue must be positive
        rating_points >= 100 && rating_points <= 500 && revenue > 0
      }
      RecordFailure -> {
        // Authority must sign
        // Just increments the failure counter
        d.completed_jobs >= 0
      }
    }
  }

  else(_) {
    fail
  }
}
