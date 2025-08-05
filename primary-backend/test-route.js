const express = require('express');
const { z } = require('zod');
const { UserRole } = require('@prisma/client');

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(Object.values(UserRole)),
  name: z.string().optional(),
});

const app = express();
app.use(express.json());

app.post("/test-signup", async (req, res) => {
  try {
    console.log("Received body:", req.body);
    
    const parsedBody = SigninSchema.safeParse(req.body);
    console.log("Parsed body:", parsedBody);

    if (!parsedBody.success) {
      console.log("Validation error:", parsedBody.error.errors);
      return res
        .status(400)
        .json({ message: "Invalid Input", error: parsedBody.error.errors });
    }

    const { email, password, role, name } = parsedBody.data;
    console.log("Extracted data:", { email, password, role, name });

    res.json({
      message: "Validation successful",
      data: { email, role, name }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Something went wrong!", error: error.message });
  }
});

app.listen(5001, () => {
  console.log("Test server running on port 5001");
}); 