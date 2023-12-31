import { Schema, model, models } from "mongoose";

const confirmationRequestSchema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    teamLeader: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Team Leader is required"],
    },
    teamMemberEmail: {
      type: String,
      required: [true, "Team Member Email is required"],
    },
  },
  { timestamps: true }
);

const ConfirmationRequest =
  (models && models.ConfirmationRequest) ||
  model("ConfirmationRequest", confirmationRequestSchema);
export default ConfirmationRequest;
