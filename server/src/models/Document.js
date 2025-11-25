import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'Untitled Document'
    },
    content: {
      type: String,
      default: ''
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    shareId: {
  type: String,
  unique: true,
  sparse: true
},
isPublic: {
  type: Boolean,
  default: false
}

  },
  { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
