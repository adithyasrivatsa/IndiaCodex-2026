use aiken/hash.{Blake2b_224, Hash}
use aiken/transaction.{ScriptContext, Transaction}
use aiken/transaction/credential.{VerificationKey}

// The datum stores the conditions of the escrow
type EscrowDatum {
  consumer: Hash<Blake2b_224, VerificationKey>,
  provider: Hash<Blake2b_224, VerificationKey>,
  service_id: ByteArray, // UUID of the AI service
  price: Int, // Price in Lovelace
}

// The redeemer specifies the action being taken
type EscrowRedeemer {
  CompleteInference
  RefundConsumer
}

validator {
  fn escrow(datum: EscrowDatum, redeemer: EscrowRedeemer, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, .. } = ctx
    let Transaction { extra_signatories, .. } = transaction

    when redeemer is {
      // The provider completes the AI inference and claims the ADA
      CompleteInference ->
        // In a real scenario, this would check an Oracle or cryptographic proof.
        // For the MVP, we ensure the provider is the one signing the transaction to claim funds.
        list.has(extra_signatories, datum.provider)

      // The consumer cancels the request and gets refunded
      RefundConsumer ->
        // Only the consumer who created the request can trigger a refund
        list.has(extra_signatories, datum.consumer)
    }
  }
}
