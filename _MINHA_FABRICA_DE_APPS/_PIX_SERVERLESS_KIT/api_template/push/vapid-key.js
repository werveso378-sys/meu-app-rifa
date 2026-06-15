export default function handler(req, res) {
  const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || 'BLqLhw2gqsuw7dX15HJmL9mx652r3FBViKcbjTYsvPf1BNGOiORuW8mAeoQHnb9d0h3ZB0XacxfriFq-FHm6FPY';
  res.status(200).json({ publicKey: VAPID_PUBLIC });
}
