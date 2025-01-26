window.API_BASE = "http://localhost:8000/api";

window.onload = function () {
    if (!localStorage.getItem("access_token")) {
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            history.go(1); // Redireciona para frente se o botão "Voltar" for usado
        };
    }
};