"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { QrCode, CreditCard, Receipt, Smartphone } from "lucide-react";
import Link from "next/link";

export default function SalesSimulator() {
	const [loading, setLoading] = useState(false);

	const triggerSale = async (templateId: string) => {
		setLoading(true);
		try {
			const APP_ID = "4328a8ae-8f0c-4ed5-a964-b5dd5c76f276";
			const REST_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_REST_API_KEY || "COLE_SUA_REST_API_KEY_AQUI";

			if (REST_API_KEY === "COLE_SUA_REST_API_KEY_AQUI") {
				toast.error("Configure sua OneSignal REST API Key no código ou no arquivo .env.local!");
				setLoading(false);
				return;
			}

			let heading = "Nova Notificação!";
			let content = "Teste";
			let largeIcon = "";
			let accentColor = "FF3A4B3C"; // Verde Lodo ARGB
			let type = "";
			let amount = 0;

			// URLs de Ícones (Imagens hospedadas em servidores públicos e confiáveis sem bloqueio de Hotlink)
			const iconeKiwify = "https://logo.clearbit.com/kiwify.com.br";
			const iconeCakto = "https://cakto.com.br/wp-content/uploads/2023/10/favicon.png";
			const iconeSinoAnimado = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Bell_icon.svg/512px-Bell_icon.svg.png";

			switch (templateId) {
				case "pix_gerado":
					heading = "⏳ Pix Gerado!";
					content = "Um novo Pix no valor de R$ 97,00 foi gerado e aguarda pagamento.";
					largeIcon = iconeSinoAnimado;
					type = "Pix Gerado";
					amount = 97.00;
					break;
				case "pagamento_aprovado":
					heading = "✅ Pagamento Aprovado!";
					content = "O pagamento foi confirmado com sucesso.";
					largeIcon = iconeSinoAnimado;
					type = "Aprovado";
					amount = 147.00;
					break;
				case "rifa_reservado":
					heading = "🎟️ Números Reservados!";
					content = "Seus números foram reservados na rifa. Pague agora para garantir!";
					largeIcon = iconeSinoAnimado;
					type = "Rifa";
					amount = 5.00;
					break;
				case "venda_kiwify":
					heading = "🟢 Venda Aprovada!";
					content = "Venda de R$ 97,00 via Pix";
					largeIcon = iconeKiwify;
					type = "Kiwify";
					amount = 97.00;
					break;
				case "venda_cakto":
					heading = "💳 Nova compra recebida!";
					content = "Você acabou de fazer uma venda de R$ 297,00";
					largeIcon = iconeCakto;
					type = "Cakto";
					amount = 297.00;
					break;
			}

			const response = await fetch("https://onesignal.com/api/v1/notifications", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `key ${REST_API_KEY}`
				},
				body: JSON.stringify({
					app_id: APP_ID,
					included_segments: ["Total Subscriptions", "Subscribed Users", "Active Users"],
					headings: { "en": heading },
					contents: { "en": content },
					data: { type, amount }, 
					large_icon: largeIcon,
					android_accent_color: accentColor // Aplica a cor na bolinha atrás do ícone pequeno
				})
			});

			const responseData = await response.json();
			console.log("OneSignal Response:", responseData);

			if (!response.ok || responseData.errors) {
				throw new Error("Falha ao enviar notificação OneSignal");
			}

			if (responseData.recipients === 0) {
				toast.warning("Notificação enviada, mas alcançou 0 aparelhos. Verifique se deu permissão no Android.");
			} else {
				toast.success(`Notificação "${type}" enviada para ${responseData.recipients} aparelho(s)!`);
			}
		} catch (error) {
			console.error("Erro ao simular venda:", error);
			toast.error("Erro ao enviar notificação. Verifique sua REST API Key.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
			<div className="absolute top-4 right-4">
				<Link href="/receiver" className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-gray-300 px-4 py-2 rounded-full text-sm transition-colors border border-zinc-800">
					<Smartphone size={16} />
					Modo Recebedor (App)
				</Link>
			</div>

			<div className="max-w-md w-full space-y-6 bg-zinc-950 p-8 rounded-3xl border border-zinc-900 shadow-2xl relative overflow-hidden mt-10">
				{/* Aesthetic glow (Verde Lodo / Verde Musgo) */}
				<div className="absolute -top-24 -left-24 w-48 h-48 bg-[#3A4B3C] rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-pulse"></div>

				<div className="text-center relative z-10 pb-4">
					<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
						Simulador Avançado
					</h1>
					<p className="text-gray-400 mt-2 text-sm">
						Envie notificações com estilos premium para o seu aplicativo.
					</p>
				</div>

				<div className="space-y-3 relative z-10">
					
					{/* Botão Pix Gerado */}
					<button onClick={() => triggerSale("pix_gerado")} disabled={loading} className="w-full group flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-500/50 p-4 rounded-2xl transition-all duration-300 active:scale-95">
						<div className="flex items-center gap-4">
							<div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-500 group-hover:scale-110 transition-transform">
								<QrCode size={20} />
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-gray-200">Pix Gerado</h3>
								<p className="text-xs text-gray-500">⏳ Um novo Pix gerado</p>
							</div>
						</div>
					</button>

					{/* Botão Pagamento Aprovado */}
					<button onClick={() => triggerSale("pagamento_aprovado")} disabled={loading} className="w-full group flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-2xl transition-all duration-300 active:scale-95">
						<div className="flex items-center gap-4">
							<div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
								<CreditCard size={20} />
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-gray-200">Pagamento Aprovado</h3>
								<p className="text-xs text-gray-500">✅ Compra aprovada com sucesso</p>
							</div>
						</div>
					</button>

					{/* Botão Rifa */}
					<button onClick={() => triggerSale("rifa_reservado")} disabled={loading} className="w-full group flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 p-4 rounded-2xl transition-all duration-300 active:scale-95">
						<div className="flex items-center gap-4">
							<div className="bg-orange-500/10 p-3 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
								<Receipt size={20} />
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-gray-200">Números da Rifa</h3>
								<p className="text-xs text-gray-500">🎟️ Reservados com sucesso</p>
							</div>
						</div>
					</button>

					{/* Botão Kiwify */}
					<button onClick={() => triggerSale("venda_kiwify")} disabled={loading} className="w-full group flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-green-500/50 p-4 rounded-2xl transition-all duration-300 active:scale-95 mt-4">
						<div className="flex items-center gap-4">
							<div className="bg-green-500/10 p-3 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
								<span className="font-black text-xl">K</span>
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-gray-200">Estilo Kiwify</h3>
								<p className="text-xs text-gray-500">🟢 Venda Aprovada!</p>
							</div>
						</div>
					</button>

					{/* Botão Cakto */}
					<button onClick={() => triggerSale("venda_cakto")} disabled={loading} className="w-full group flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 p-4 rounded-2xl transition-all duration-300 active:scale-95">
						<div className="flex items-center gap-4">
							<div className="bg-blue-500/10 p-3 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
								<span className="font-black text-xl">C</span>
							</div>
							<div className="text-left">
								<h3 className="font-semibold text-gray-200">Estilo Cakto</h3>
								<p className="text-xs text-gray-500">💳 Nova compra recebida</p>
							</div>
						</div>
					</button>

				</div>
			</div>
		</div>
	);
}
