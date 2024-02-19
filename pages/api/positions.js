import mongoose from 'mongoose';

export default async function GET(req, resp) {
  try {
    if (mongoose.connection.readyState !== 1)
      await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);

    const db = mongoose.connection.useDb('gessad-db');
    const Pos = db.collection('positions');

    if (req.method.toLowerCase() === 'post') {
      const { type } = req.query;
      const { _id, candidate_index, voter_id, voted } = JSON.parse(req.body);
      if (type === 'vote') {
        const id = new mongoose.Types.ObjectId(_id);
        const doc = await Pos.findOne({ _id: id });
        const _doc = { ...doc };
        _doc.candidates = _doc.candidates.map((c) => {
          return {
            ...c,
            votes: [...c.votes.filter((v) => v !== voter_id)],
          };
        });
        const can = _doc.candidates[candidate_index];
        if (voted) can.votes = [...new Set([...can.votes, voter_id])];
        delete _doc._id;
        await Pos.findOneAndUpdate({ _id: id }, { $set: _doc });
        return resp.json(_doc.candidates);
      }
    } else if (req.method.toLowerCase() === 'get') {
      const pos = await Pos.find().toArray();
      return resp.json(pos);
    }

    resp.json([]);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: error.message });
  }
}
