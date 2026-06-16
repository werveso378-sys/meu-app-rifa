package com.example.data

import com.google.firebase.firestore.PropertyName

data class Ticket(
    val number: Int = 0,
    var ownerName: String? = null,
    var phone: String? = null,
    var paymentType: String? = null, // "PIX", "MIMO", etc
    
    @get:PropertyName("isPaid")
    @set:PropertyName("isPaid")
    var isPaid: Boolean = false
) {
    // Empty constructor for Firestore
    constructor() : this(0, null, null, null, false)
}

data class AppSettings(
    val pixPrice: Double = 40.0,
    val totalNumbers: Int = 100,
    val fcmToken: String? = null,
    val soundsEnabled: Boolean = true,
    val popupActive: Boolean = false,
    val popupMessage: String = ""
) {
    constructor() : this(40.0, 100, null, true, false, "")
}
