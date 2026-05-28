import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "O nome é obrigatório."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "O e-mail é obrigatório."],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/, "Insira um e-mail válido."]
    },
    password: {
        type: String,
        required: [true, "A senha é obrigatória."],
        minLength: [8, "A senha deve conter no mínimo 8 caracteres."]
    },
});

export const User = mongoose.model("User", userSchema);