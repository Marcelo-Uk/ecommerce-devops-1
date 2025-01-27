from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def test_e2e_workflow():
    # Inicializa o WebDriver para Firefox
    driver = webdriver.Firefox()

    try:
        # Passo 1: Acessar o endereço
        driver.get("http://127.0.0.1:5500/")
        assert "Login" in driver.title  # Verifica o título da página
        print("Página inicial carregada com sucesso.")
        time.sleep(3)

        # Passo 2: Preencher os dados de login
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username"))).send_keys("cliente1")
        time.sleep(2)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "password"))).send_keys("teste@123")
        time.sleep(2)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "loginForm"))).submit()
        time.sleep(2)
        print("Login enviado, aguardando redirecionamento...")
        time.sleep(3)  # Aguarda o redirecionamento para a página de produtos

        # Passo 3: Adicionar dois produtos ao carrinho
        try:
            # Aguarda até que os botões "Adicionar ao Carrinho" sejam renderizados
            add_to_cart_buttons = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "btn-add-to-cart"))
            )
            assert len(add_to_cart_buttons) >= 2, "Não foram encontrados botões suficientes para adicionar produtos ao carrinho."
            print(f"Encontrados {len(add_to_cart_buttons)} produtos na página.")

            # Adiciona dois produtos ao carrinho
            add_to_cart_buttons[0].click()
            time.sleep(1)  # Aguarda o popup
            driver.switch_to.alert.accept()
            add_to_cart_buttons[1].click()
            time.sleep(1)  # Aguarda o popup
            driver.switch_to.alert.accept()
            print("Dois produtos adicionados ao carrinho com sucesso.")
        except Exception as e:
            print("Erro ao adicionar produtos ao carrinho:", e)
            raise

        # Passo 4: Acessar a página do carrinho
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Carrinho"))).click()
        print("Página do carrinho acessada com sucesso.")
        time.sleep(2)  # Aguarda o redirecionamento para a página do carrinho

        # Passo 5: Clicar em "Ir para Pagamento" e confirmar o popup
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "checkout"))).click()
        time.sleep(1)  # Aguarda o popup
        driver.switch_to.alert.accept()
        print("Ir para pagamento confirmado.")

        # Passo 6: Na página de pagamento, clicar no botão "Pagar"
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "btn-pay"))).click()
        print("Página de pagamento acessada.")
        time.sleep(2)  # Aguarda o redirecionamento para a página de cartões

        # Passo 7: Preencher os dados do cartão
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "cardNumber"))).send_keys("4098876198017657")
            driver.find_element(By.ID, "cardName").send_keys("MARCELO R ANDRADE")
            driver.find_element(By.ID, "cardExpiry").send_keys("12/27")
            driver.find_element(By.ID, "cardCVV").send_keys("509")

            # Seleciona o tipo de pagamento "Crédito"
            credito_radio_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='paymentType'][value='credito']"))
            )
            credito_radio_button.click()
            print("Opção de pagamento 'Crédito' selecionada com sucesso.")
        except Exception as e:
            print("Erro ao preencher os dados do cartão:", e)
            print(driver.page_source)  # Loga o HTML da página para depuração
            raise

        # Passo 8: Clicar em Enviar
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "btn-submit"))).click()
        time.sleep(3)  # Aguarda o primeiro popup
        driver.switch_to.alert.accept()
        print("Primeiro popup fechado.")

        # Passo 9: Confirmar o segundo popup
        time.sleep(2)  # Aguarda o segundo popup
        driver.switch_to.alert.accept()
        print("Segundo popup fechado.")

        # Passo 10: Aguardar redirecionamento para a página de login
        WebDriverWait(driver, 10).until(EC.title_is("Produtos"))
        print("Teste E2E concluído com sucesso: Redirecionado para a página de Produtos.")

    finally:
        # Fecha o navegador ao final do teste
        driver.quit()
