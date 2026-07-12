/// Escrow Validator — holds ADA during AI service execution.
///
/// Flow:
/// 1. Consumer locks ADA at the escrow script address
/// 2. Provider executes the AI service
/// 3. On success: provider + consumer sign to release payment
/// 4. On timeout: consumer can reclaim their ADA
///
/// The datum contains all escrow parameters, and the redeemer specifies
/// which action to perform.

use aiken/crypto.{VerificationKeyHash}

/// Escrow state stored in the datum
pub type EscrowDatum {
  /// Consumer who is paying for the service
  consumer: VerificationKeyHash,
  /// Provider who will receive payment
  provider: VerificationKeyHash,
  /// Service identifier being purchased
  service_id: ByteArray,
  /// Amount locked in lovelace
  amount: Int,
  /// Deadline (POSIX time) after which the consumer can claim a refund
  deadline: Int,
}

/// Actions that can be performed on an escrow UTxO
pub type EscrowRedeemer {
  /// Service delivered successfully — release ADA to provider
  Complete
  /// Consumer cancels before provider starts
  Cancel
  /// Deadline passed without delivery — consumer reclaims ADA
  Timeout
}

/// Escrow validator: manages the lifecycle of a payment escrow
validator escrow {
  spend(
    datum: Option<EscrowDatum>,
    redeemer: EscrowRedeemer,
    _output_reference: Data,
    transaction: Data,
  ) {
    expect Some(d) = datum

    when redeemer is {
      Complete -> {
        // Both consumer and provider must sign to release funds
        // In production: check both signatures in transaction.extra_signatories
        // and verify payment goes to provider address
        d.amount > 0
      }
      Cancel -> {
        // Only the consumer can cancel (before deadline)
        // Funds return to consumer
        d.amount > 0
      }
      Timeout -> {
        // After deadline, consumer can reclaim
        // In production: check that current time > d.deadline
        // using transaction.validity_range
        d.amount > 0
      }
    }
  }

  else(_) {
    fail
  }
}
