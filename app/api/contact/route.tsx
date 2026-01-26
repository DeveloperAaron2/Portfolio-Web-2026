import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Faltan campos" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
    });
    await transporter.verify();
    await transporter.sendMail({
      from: `"Contacto Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Nuevo contacto desde el portfolio",
      html: `
        <h3>Nuevo contacto</h3>
        <p><strong>Nombre / Empresa:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando email" },
      { status: 500 }
    );
  }
}
