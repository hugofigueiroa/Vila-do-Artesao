exports.exibirLocalizacao = async (req, res) => { // Função responsável por exibir a página de localização ; 
    try {
        res.render("user/localizacao"); // Renderizando a página de localização ;  
    }
    catch (error) {
        res.redirect("/api/user/localizacao"); // Redirecionando em caso de erro ; 
    }
}