package com.example.ui

import android.annotation.SuppressLint
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.viewinterop.AndroidView

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun NumbersScreen(
    modifier: Modifier = Modifier
) {
    // State for custom JS alert dialog
    var jsAlertMessage by remember { mutableStateOf<String?>(null) }
    var jsAlertResult by remember { mutableStateOf<JsResult?>(null) }

    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.mediaPlaybackRequiresUserGesture = false // Allow sounds to play
                webViewClient = WebViewClient()
                webChromeClient = object : WebChromeClient() {
                    override fun onJsAlert(
                        view: WebView?,
                        url: String?,
                        message: String?,
                        result: JsResult?
                    ): Boolean {
                        // Intercept JS alert and show styled dialog
                        jsAlertMessage = message
                        jsAlertResult = result
                        return true // We handle it ourselves
                    }
                }
                loadUrl("https://meu-app-rifa.vercel.app/")
            }
        },
        update = { webView ->
            // No update needed
        }
    )

    // Styled alert dialog instead of ugly black WebView alert
    if (jsAlertMessage != null) {
        AlertDialog(
            onDismissRequest = {
                jsAlertResult?.confirm()
                jsAlertMessage = null
                jsAlertResult = null
            },
            title = {
                Text(
                    "🧸 Chá Rifa Baby",
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF4C6A2B)
                )
            },
            text = {
                Text(
                    jsAlertMessage ?: "",
                    color = Color(0xFF5A3E26)
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        jsAlertResult?.confirm()
                        jsAlertMessage = null
                        jsAlertResult = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4C6A2B))
                ) {
                    Text("OK", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = Color(0xFFF8F5EC)
        )
    }
}
