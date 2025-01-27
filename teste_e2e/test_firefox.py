from selenium import webdriver

def test_firefox():
    # Inicializa o Firefox
    driver = webdriver.Firefox()

    # Acessa o Google como exemplo
    driver.get("https://www.google.com")

    # Verifica o título da página
    assert "Google" in driver.title

    # Fecha o navegador
    driver.quit()

# Chame a função para verificar
test_firefox()
