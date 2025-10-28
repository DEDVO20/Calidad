export interface LoginData {
  usuario: string;
  contrasena: string;
}

export async function login(data: LoginData) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login fallido" }));
      throw new Error(error.message);
    }

    const result = await response.json();
    console.log("Login resultado:", result);

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      console.log("Token almacenado:", result.token);
    }
    return result;
  } catch (error) {
    console.error("Error en login:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error desconocido");
  }
}

export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Logout fallido" }));
      throw new Error(errorData.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en logout:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error desconocido");
  }
}

//Funcion para obtener el token del usuario
export function getToken(): string | null {
  return localStorage.getItem("token");
}

//Funcion para obtener el usuario actual
export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

//Funcion para verificar si el usuario esta autenticado
export function isAuthenticated(): boolean {
  const token = getToken();
  return token !== null && token !== "";
}

//Funcion para limpiar la sesion del usuario
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
