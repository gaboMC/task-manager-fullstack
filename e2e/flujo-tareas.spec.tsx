import { test, expect } from '@playwright/test'
 
test('un usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  await page.goto('/')
 
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('gabo.test@gmail.com')
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('12345')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await page.getByPlaceholder('Escribe una nueva tarea...').fill('Investigar Playwright')
  await page.getByRole('button', { name: 'Add' }).click()
 
  await expect(page.getByText('Investigar Playwright')).toBeVisible()
})
