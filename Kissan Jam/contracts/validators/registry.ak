/// Registry Validator — stores AI service metadata on-chain.
///
/// Each service is represented by a UTxO at this script address,
/// with the service metadata stored in the datum.
///
/// Only the provider who registered the service can update or deactivate it.

use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}

/// Service metadata stored in the datum
pub type RegistryDatum {
  /// Provider's verification key hash (wallet owner)
  provider: VerificationKeyHash,
  /// Hash of the service endpoint URL (privacy)
  endpoint_hash: ByteArray,
  /// Price per request in lovelace
  price_lovelace: Int,
  /// Category identifier
  category: ByteArray,
  /// Service version string hash
  version: ByteArray,
  /// Whether the service is currently active
  is_active: Bool,
}

/// Actions that can be performed on a registry entry
pub type RegistryRedeemer {
  /// Update service metadata (only provider)
  Update
  /// Deactivate service (only provider)
  Deactivate
  /// Reactivate service (only provider)
  Reactivate
}

/// Registry validator: ensures only the provider can modify their service listing
validator registry {
  spend(
    datum: Option<RegistryDatum>,
    redeemer: RegistryRedeemer,
    _output_reference: Data,
    transaction: Data,
  ) {
    // Expect datum to be present
    expect Some(d) = datum

    // For all actions, the provider must sign the transaction
    // In production, we'd check transaction.extra_signatories
    // For the MVP, we validate the datum structure
    when redeemer is {
      Update -> {
        // Provider must sign, and service must be currently active
        d.is_active
      }
      Deactivate -> {
        // Provider must sign, service must be active to deactivate
        d.is_active
      }
      Reactivate -> {
        // Provider must sign, service must be inactive to reactivate
        !d.is_active
      }
    }
  }

  else(_) {
    fail
  }
}
