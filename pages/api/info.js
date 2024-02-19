import mongoose from 'mongoose';

export default async function GET(req, resp) {
  try {
    if (mongoose.connection.readyState !== 1)
      await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);

    const db = mongoose.connection.useDb('gessad-db');
    const Info = db.collection('info');
    const info = await Info.find().toArray();
    resp.json(info[0] || {});
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
}
