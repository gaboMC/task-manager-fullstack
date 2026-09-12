// e2e/flujo-tareas.spec.tsx
import { test, expect } from '@playwright/test'
 
test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  // 1. Interceptar el Login (Simula una respuesta exitosa sin ir al Backend)
  await page.route('**/api/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-jwt-token', user: { email: 'gabo.test@gmail.com' } })
    });
  });

  // 2. Interceptar el guardado y consulta de tareas
  await page.route('**/api/tasks', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 99, text: 'Investigar Playwright', completed: false })
      });
    } else {
      // Devuelve una lista inicial vacía para asegurar un entorno controlado
      await route.fulfill({ status: 200, json: [] });
    }
  });

  // 3. Flujo normal en la interfaz del Frontend
  await page.goto('/')
 
  // Cambiar a la pantalla de login e iniciar sesión
  await page.getByText('¿Ya tienes cuenta? Inicia sesión').click()
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('gabo.test@gmail.com')
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  // Crear la tarea utilizando tu placeholder real
  await page.getByPlaceholder('Escribe una nueva tarea...').fill('Investigar Playwright')
  await page.getByRole('button', { name: 'Add' }).click()
 
  // Validar de forma segura usando el filtro por contenedor
  const nuevaTarea = page.getByRole('listitem').filter({ hasText: 'Investigar Playwright' });
  await expect(nuevaTarea.first()).toBeVisible();
})

