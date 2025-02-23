import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller function to manage Clerk user database
export const clerkWebHooks = async (req, res) => {
    try {
        // Periksa apakah body ada
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Empty request body" });
        }

        // Cek apakah secret tersedia
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            throw new Error("CLERK_WEBHOOK_SECRET is missing");
        }

        // Buat instance webhook dari Svix
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verifikasi headers dari request
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Ambil data dari request body
        const { data, type } = req.body;

        // Pilih jenis event berdasarkan tipe
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                    resume: "",
                };
                await User.create(userData);
                return res.status(201).json({ success: true, message: "User created" });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                };
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                return res.status(200).json({ success: true, message: "User updated" });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.status(200).json({ success: true, message: "User deleted" });
            }

            default:
                return res.status(400).json({ success: false, message: "Unknown event type" });
        }
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(500).json({ success: false, message: "Webhooks Error", error: error.message });
    }
};
