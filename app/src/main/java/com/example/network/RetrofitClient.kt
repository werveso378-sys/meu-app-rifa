package com.example.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

data class PixRequest(
    val raffleId: String,
    val customerName: String,
    val customerPhone: String,
    val value: Double,
    val numbers: List<Int>
)

data class PixResponse(
    val success: Boolean,
    val chargeId: String?,
    val qrCode: String?,
    val payload: String?,
    val error: String?
)

interface PixApiService {
    @POST("/api/pix/create-mp")
    suspend fun createPix(@Body request: PixRequest): PixResponse
}

object RetrofitClient {
    // URL oficial gerada pela Vercel após o deploy do projeto
    private const val BASE_URL = "https://meu-app-rifa.vercel.app"

    val instance: PixApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PixApiService::class.java)
    }
}
