/// Shared types for AdaCompute smart contracts

/// Represents a provider's wallet address (verification key hash)
pub type ProviderHash = ByteArray

/// Represents a consumer's wallet address (verification key hash)
pub type ConsumerHash = ByteArray

/// Service identifier (unique hash)
pub type ServiceId = ByteArray

/// Price in lovelace (1 ADA = 1,000,000 lovelace)
pub type Lovelace = Int

/// Unix timestamp in POSIX milliseconds
pub type PosixTime = Int
