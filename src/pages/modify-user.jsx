import { useState } from "react";
import { TextField, Button, TextareaAutosize, Input } from "@mui/material";
import { Main } from "../components/main";
import { API_HOST } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import { useCurrentUser } from "../hooks/use-current-user";
import { tlds } from "@hapi/tlds";

const modifyUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: tlds } })
    .messages({
      "string.min": "El correo electrónico debe tener más de 4 caracteres.",
      "string.max": "El correo electrónico debe tener menos de 100 caracteres.",
    }),
  username: Joi.string().min(4).max(100).messages({
    "string.min": "El nombre de usuario debe tener más de 4 caracteres.",
    "string.max": "El nombre de usuario debe tener menos de 100 caracteres.",
  }),
  password: Joi.string().required().messages({
    "any.required":
      "Por motivos de seguridad, es obligatorio que coloques tu contraseña.",
  }),
  bio: Joi.string().min(4).max(255).messages({
    "string.min": "La biografía debe tener más de 4 caracteres.",
    "string.max": "La biografía debe tener menos de 255 caracteres.",
  }),
  address: Joi.string().min(4).max(100).messages({
    "string.min": "La dirección debe tener más de 4 caracteres.",
    "string.max": "La dirección debe tener menos de 100 caracteres.",
  }),
});

function ModifyUserPage() {
  const navigate = useNavigate();

  const user = useCurrentUser();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    address: "",
    password: "",
    profile_pic: null, // Esto se maneja abajo
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = modifyUserSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      setValidationErrors(errors);
      return;
    }

    const requestBody = {
      username: formData.username,
      email: formData.email,
      bio: formData.bio,
      address: formData.address,
      password: formData.password,
    };

    try {
      const response = await fetch(API_HOST + "/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_pic") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <Main>
      <h1 className="text-4xl block self-center">Modificar usuario</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:px-44 lg:px-60 xl:px-96"
      >
        <TextField
          label="Nombre de usuario"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          error={Boolean(validationErrors.username)}
          helperText={validationErrors.username}
        />
        <TextField
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={Boolean(validationErrors.email)}
          helperText={validationErrors.email}
        />
        <TextareaAutosize
          minRows={3}
          placeholder="Biografía"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          className={validationErrors.bio ? "error" : ""}
        />
        <TextField
          label="Dirección"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          error={Boolean(validationErrors.address)}
          helperText={validationErrors.address}
        />
        <Input
          label="Foto de perfil"
          type="file"
          name="profile_pic"
          onChange={handleInputChange}
        />
        <TextField
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={Boolean(validationErrors.password)}
          helperText={validationErrors.password}
        />
        <p className="flex justify-center gap-2">
          Es obligatorio que coloques tu contraseña actual, si quieres cambiar
          la contraseña
          <Link
            to="/users/recovery-password"
            style={{ color: "var(--quaternary-color)" }}
          >
            haz click aqui
          </Link>
          .
        </p>
        <Button id="button" type="submit" variant="contained" color="primary">
          Actualizar usuario
        </Button>
      </form>
    </Main>
  );
}

export default ModifyUserPage;