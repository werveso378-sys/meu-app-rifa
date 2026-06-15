package com.example.data

data class Ticket(
    val number: Int = 0,
    var ownerName: String? = null,
    var phone: String? = null,
    var paymentType: String? = null, // "PIX", "MIMO", etc
    var isPaid: Boolean = false
) {
    // Empty constructor for Firestore
    constructor() : this(0, null, null, null, false)
}
