const webpush = require('web-push');
const firebaseAdminService = require('../../_services/firebaseAdminService');

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY  || 'BLqLhw2gqsuw7dX15HJmL9mx652r3FBViKcbjTYsvPf1BNGOiORuW8mAeoQHnb9d0h3ZB0XacxfriFq-FHm6FPY';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || 'LWg0Cq5ycqYL6zJcF6-fYJqKgbAIKN7ZuUSHOgXGQ9M';

webpush.setVapidDetails('mailto:admin@rifababygo.com', VAPID_PUBLIC, VAPID_PRIVATE);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });

    // Persist to Firebase so it survives serverless restarts
    const id = Buffer.from(subscription.endpoint).toString('base64').slice(-20);
    await firebaseAdminService.db.collection('admin_push_subscriptions').doc(id).set({ 
      subscription, 
      updatedAt: new Date().toISOString() 
    });
    console.log(`[Push Serverless] Nova assinatura salva.`);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[Push Serverless] Erro ao salvar assinatura:', err.message);
    res.status(500).json({ error: 'Falha ao salvar assinatura' });
  }
}
