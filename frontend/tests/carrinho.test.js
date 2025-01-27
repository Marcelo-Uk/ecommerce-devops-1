import { renderCartItems } from "../assets/js/carrinho";

describe("Testes da página do carrinho", () => {
    beforeEach(() => {
        // Mock do DOM
        document.body.innerHTML = `
            <div id="cart-items"></div>
            <p id="total-price"></p>
        `;

        // Mock do localStorage
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });

        // Mock do console.error para evitar logs desnecessários
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Deve carregar e renderizar os itens do carrinho corretamente", () => {
        // Mock do localStorage para retornar itens fictícios
        localStorage.getItem.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 1,
                    titulo: "Produto 1",
                    preco: "100.00",
                    foto: "produto1.jpg",
                    quantidade: 2,
                },
                {
                    id: 2,
                    titulo: "Produto 2",
                    preco: "50.00",
                    foto: "produto2.jpg",
                    quantidade: 1,
                },
            ])
        );

        renderCartItems();

        // Verifica se os itens foram renderizados corretamente
        const cartItems = document.querySelectorAll(".cart-item");
        expect(cartItems.length).toBe(2);

        // Verifica se o preço total foi calculado corretamente
        const totalPrice = document.getElementById("total-price").textContent;
        expect(totalPrice).toBe("Total: R$ 250.00");
    });
});
