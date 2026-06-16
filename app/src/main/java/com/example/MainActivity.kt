package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.google.firebase.firestore.FirebaseFirestore
import com.example.data.TicketRepository
import com.example.ui.AppScreen
import com.example.ui.MainViewModel
import com.example.ui.MainViewModelFactory
import com.example.ui.theme.MyApplicationTheme
import android.Manifest
import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Log
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.firestore.SetOptions

class MainActivity : ComponentActivity() {

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Log.d("MainActivity", "Permissão de notificação concedida")
            Toast.makeText(this, "🔔 Notificações ativadas com sucesso!", Toast.LENGTH_SHORT).show()
        } else {
            Log.d("MainActivity", "Permissão de notificação negada")
            // Show dialog explaining why notifications are important
            showNotificationExplanationDialog()
        }
    }

    private val viewModel: MainViewModel by viewModels {
        val firestore = FirebaseFirestore.getInstance()
        val repo = TicketRepository(firestore)
        MainViewModelFactory(repo)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        createNotificationChannels()
        setupFCMToken()

        // Wait for window to attach before asking permission/showing dialogs
        android.os.Handler(android.os.Looper.getMainLooper()).post {
            askNotificationPermission()
        }

        setContent {
            MyApplicationTheme {
                AppScreen(viewModel = viewModel)
            }
        }
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
            
            // Canal Padrão
            val channelDefault = android.app.NotificationChannel("rifas_vendas", "Vendas e Alertas", android.app.NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channelDefault)

            // Canal Pix Gerado
            val channelPix = android.app.NotificationChannel("pix_pendente", "Pix Gerado", android.app.NotificationManager.IMPORTANCE_HIGH).apply {
                val soundUri = android.net.Uri.parse("android.resource://" + packageName + "/" + com.example.R.raw.som_pix_gerado)
                val audioAttributes = android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION).build()
                setSound(soundUri, audioAttributes)
            }
            notificationManager.createNotificationChannel(channelPix)

            // Canal Venda Confirmada
            val channelSale = android.app.NotificationChannel("venda_confirmada", "Venda Confirmada", android.app.NotificationManager.IMPORTANCE_HIGH).apply {
                val soundUri = android.net.Uri.parse("android.resource://" + packageName + "/" + com.example.R.raw.som_venda_confirmada)
                val audioAttributes = android.media.AudioAttributes.Builder().setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION).build()
                setSound(soundUri, audioAttributes)
            }
            notificationManager.createNotificationChannel(channelSale)
        }
    }

    override fun onResume() {
        super.onResume()
        checkPermissions()
    }

    private fun checkPermissions() {
        val areEnabled = androidx.core.app.NotificationManagerCompat.from(this).areNotificationsEnabled()
        if (!areEnabled) {
            showNotificationExplanationDialog()
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            showOverlayExplanationDialog()
            return
        }
    }

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            } else {
                checkPermissions()
            }
        } else {
            checkPermissions()
        }
    }

    private var notificationDialogShown = false
    private var overlayDialogShown = false

    private fun showNotificationExplanationDialog() {
        if (notificationDialogShown) return
        notificationDialogShown = true

        AlertDialog.Builder(this)
            .setTitle("🔔 Notificações são essenciais!")
            .setMessage(
                "Para acompanhar as vendas da sua Chá Rifa Baby em tempo real, é obrigatório ativar as notificações.\n\n" +
                "Você será notificado quando:\n" +
                "• Um Pix for gerado 💸\n" +
                "• Um pagamento for confirmado 💰\n" +
                "• Uma reserva de mimo for feita 🎁\n\n" +
                "Deseja ativar agora?"
            )
            .setPositiveButton("Ativar nas Configurações") { _, _ ->
                notificationDialogShown = false
                val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                    putExtra(Settings.EXTRA_APP_PACKAGE, packageName)
                }
                startActivity(intent)
            }
            .setNegativeButton("Depois") { dialog, _ ->
                notificationDialogShown = false
                dialog.dismiss()
                Toast.makeText(this, "⚠️ Você não receberá alertas de vendas!", Toast.LENGTH_LONG).show()
                checkPermissions() // check overlay if notification is skipped
            }
            .setCancelable(false)
            .show()
    }

    private fun showOverlayExplanationDialog() {
        if (overlayDialogShown) return
        overlayDialogShown = true

        AlertDialog.Builder(this)
            .setTitle("📱 Permissão de Sobreposição")
            .setMessage(
                "Para que os alertas de vendas apareçam na tela mesmo com o aplicativo fechado, você precisa permitir que o app apareça sobre os outros.\n\n" +
                "Por favor, ative a opção 'Permitir sobreposição a outros apps'."
            )
            .setPositiveButton("Configurar") { _, _ ->
                overlayDialogShown = false
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    val intent = Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:$packageName")
                    )
                    startActivity(intent)
                }
            }
            .setNegativeButton("Depois") { dialog, _ ->
                overlayDialogShown = false
                dialog.dismiss()
                Toast.makeText(this, "⚠️ Alertas visuais podem não funcionar!", Toast.LENGTH_LONG).show()
            }
            .setCancelable(false)
            .show()
    }

    private fun setupFCMToken() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.w("MainActivity", "Fetching FCM registration token failed", task.exception)
                return@addOnCompleteListener
            }
            val token = task.result
            Log.d("MainActivity", "FCM Token no boot: $token")
            val db = FirebaseFirestore.getInstance()
            val data = hashMapOf("fcmToken" to token)
            db.collection("settings").document("global")
                .set(data, SetOptions.merge())
                .addOnSuccessListener { Log.d("FCM", "Token salvo no boot com sucesso") }
        }
    }
}
