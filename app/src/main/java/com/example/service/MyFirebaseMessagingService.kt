package com.example.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.example.MainActivity
import com.example.R
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("FCM", "Novo token recebido: $token")
        
        // Salva o token no Firestore para que a Vercel possa enviar a notificação para este aparelho
        val db = FirebaseFirestore.getInstance()
        db.collection("settings").document("global")
            .update("fcmToken", token)
            .addOnSuccessListener { Log.d("FCM", "Token atualizado no Firestore com sucesso") }
            .addOnFailureListener { e -> Log.w("FCM", "Erro ao atualizar token no Firestore", e) }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d("FCM", "Mensagem recebida de: ${remoteMessage.from}")

        // Se a mensagem contiver uma notificação (como as enviadas pelo nosso Webhook)
        remoteMessage.notification?.let {
            Log.d("FCM", "Corpo da notificação: ${it.body}")
            sendNotification(it.title ?: "Nova Notificação", it.body ?: "")
        }

        // Handle pure data payload (This fixes the background dropping issue)
        if (remoteMessage.data.isNotEmpty()) {
            Log.d("FCM", "Payload de dados: ${remoteMessage.data}")
            val title = remoteMessage.data["title"] ?: "Nova Notificação"
            val body = remoteMessage.data["body"] ?: ""
            sendNotification(title, body)
        }
    }

    private fun sendNotification(title: String, messageBody: String) {
        val intent = Intent(this, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        // The channel to use
        var targetChannelId = "rifas_vendas"
        var targetSoundUri = defaultSoundUri

        // Determine sound and channel based on title or logic, but FCM data payload handles this if properly sent
        // However, if we're building the notification manually here:
        if (title.contains("Pix", ignoreCase = true) || messageBody.contains("Pix", ignoreCase = true)) {
            targetChannelId = "pix_pendente"
            targetSoundUri = android.net.Uri.parse("android.resource://" + packageName + "/" + R.raw.som_pix_gerado)
        } else if (title.contains("Confirmado", ignoreCase = true) || messageBody.contains("Confirmado", ignoreCase = true) || title.contains("Recebido", ignoreCase = true)) {
            targetChannelId = "venda_confirmada"
            targetSoundUri = android.net.Uri.parse("android.resource://" + packageName + "/" + R.raw.som_venda_confirmada)
        }

        // Cria os canais de notificação no Android 8.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Canal Padrão
            val channelDefault = NotificationChannel("rifas_vendas", "Vendas e Alertas", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channelDefault)

            // Canal Pix Gerado
            val channelPix = NotificationChannel("pix_pendente", "Pix Gerado", NotificationManager.IMPORTANCE_HIGH).apply {
                val soundUri = android.net.Uri.parse("android.resource://" + packageName + "/" + R.raw.som_pix_gerado)
                val audioAttributes = android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION).build()
                setSound(soundUri, audioAttributes)
            }
            notificationManager.createNotificationChannel(channelPix)

            // Canal Venda Confirmada
            val channelSale = NotificationChannel("venda_confirmada", "Venda Confirmada", NotificationManager.IMPORTANCE_HIGH).apply {
                val soundUri = android.net.Uri.parse("android.resource://" + packageName + "/" + R.raw.som_venda_confirmada)
                val audioAttributes = android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION).build()
                setSound(soundUri, audioAttributes)
            }
            notificationManager.createNotificationChannel(channelSale)
        }

        val notificationBuilder = NotificationCompat.Builder(this, targetChannelId)
            .setSmallIcon(R.drawable.ic_stat_bear)
            .setContentTitle(title)
            .setContentText(messageBody)
            .setAutoCancel(true)
            .setSound(targetSoundUri)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
    }
}
