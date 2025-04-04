import mongoose, { Schema, type Document, type Model } from "mongoose"

// Link interface
export interface ILink {
  title: string
  url: string
  description?: string
  icon?: string
}

// Link schema
const LinkSchema = new Schema<ILink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
})

// Portal interface
export interface IPortal extends Document {
  username: string
  portalName: string
  description?: string
  slug: string
  isPrivate: boolean
  accessKey?: string
  links: ILink[]
  createdAt: Date
  updatedAt: Date
}

// Portal schema
const PortalSchema = new Schema<IPortal>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, underscores and hyphens"],
    },
    portalName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9_-]+$/, "Portal name can only contain lowercase letters, numbers, underscores and hyphens"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    accessKey: {
      type: String,
      required: function (this: IPortal) {
        return this.isPrivate
      },
    },
    links: [LinkSchema],
  },
  {
    timestamps: true,
    // Add virtual for id
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        // Don't expose the access key
        if (ret.isPrivate && ret.accessKey) {
          delete ret.accessKey
        }
      },
    },
  },
)

// Create a compound index on username and portalName
PortalSchema.index({ username: 1, portalName: 1 }, { unique: true })

// Create the slug before saving
PortalSchema.pre("save", function (next) {
  if (this.isModified("username") || this.isModified("portalName")) {
    this.slug = `${this.username}/${this.portalName}`
  }
  next()
})

// Use existing model or create a new one
const Portal: Model<IPortal> = mongoose.models.Portal || mongoose.model<IPortal>("Portal", PortalSchema)

export default Portal

