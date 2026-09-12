// e2e/flujo-tareas.spec.tsx
import { test, expect } from '@playwright/test'
 
test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // 1. Simulación total de la API (Evita usar el backend por completo)
  // Atrapa cualquier endpoint que termine en /login o auth
  await page.route('**/login**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-token', user: { email: 'gabo.test@gmail.com' } })
    });
  });

  // Atrapa cualquier endpoint de tareas (GET o POST)
  await page.route('**/tasks**', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 99, text: 'Investigar Playwright', completed: false })
      });
    } else {
      // Devuelve una lista inicial vacía instantánea
      await route.fulfill({ status: 200, json: [] });
    }
  });

  // 2. Navegar al frontend local levantado por el webServer
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // 3. Flujo inteligente de Autenticación
  // Intentamos buscar el enlace para cambiar a Login por si abrió en la pestaña de Registro
  try {
    const enlaceLogin = page.locator('text=Inicia sesión').first();
    if (await enlaceLogin.isVisible()) {
      await enlaceLogin.click();
    }
  } catch (e) {
    // Si da error o no existe, avanzamos directo al login
  }

  // Rellenar credenciales de acceso
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('gabo.test@gmail.com')
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  // 4. Crear la tarea (Utiliza el placeholder de tu componente TaskInput)
  await page.getByPlaceholder('Escribe una nueva tarea...').fill('Investigar Playwright')
  await page.getByRole('button', { name: 'Add' }).click()
 
  // 5. Confirmar que se renderizó en la lista de React de forma segura
  const nuevaTarea = page.getByRole('listitem').filter({ hasText: 'Investigar Playwright' });
  await expect(nuevaTarea.first()).toBeVisible();
})
