import mongoose from 'mongoose';

export default async function GET(req, resp) {
  try {
    if (mongoose.connection.readyState !== 1)
      await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);

    const db = mongoose.connection.useDb('gessad-db');
    const Voters = db.collection('voters');

    if (req.method.toLowerCase() === 'post') {
      const id = req.body;
      const exists = await Voters.findOne({ id });
      if (exists)
        return resp.json({
          error: `Voter's ID exists${
            exists.voted ? ' and has voted already' : ''
          }`,
        });
      await Voters.insertOne({ id, voted: false });
      resp.json({
        success: `${id} has been added to the list of Voters, you can now share it with the member.`,
      });
    } else if (req.method.toLowerCase() === 'get') {
      const id = req.query.id;
      if (!id) {
        const total = await Voters.countDocuments();
        return resp.json({ total });
      }
      const voter = await Voters.findOne({ id });
      resp.json({ voter });
    }

    resp.json([]);
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
}
