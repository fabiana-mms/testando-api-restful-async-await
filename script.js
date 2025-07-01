//Estado inicial: modo "criação", não "edição"
let editando = false;
let idEditando = null;

//Função para carregar usuários  (GET)
async function buscarUsuarios() {
   try {
      //Requisição GET: busca usuários na API, await aguarda a resposta e transforma em JSON
      const resposta = await fetch('https://jsonplaceholder.typicode.com/users');
      const dados = await resposta.json();

      //Atualiza a lista de usuários
      const container = document.getElementById('lista-usuarios');
      container.innerHTML = '';

         // Cria um elemento para cada usuário retornado da API e cria uma div com uma classe
         dados.forEach(usuario => {
            const div = document.createElement('div');
            div.classList.add('user');
            div.innerHTML = `
               <strong>Nome:</strong> ${usuario.name}<br>
               <strong>E-mail:</strong> ${usuario.email}<br>
               <strong>Telefone:</strong> ${usuario.phone}<br>
               <button onclick="editarUsuario(${usuario.id}, '${usuario.name}', '${usuario.email}', '${usuario.phone}')">Editar</button>
               <button onclick="deletarUsuario(${usuario.id}, this)">Deletar</button>
            `;
            // Adiciona a div criada ao container
            container.appendChild(div);
         });
      //Se houver um erro
      } catch(erro) {
         console.error('Erro ao buscar usuários:', erro);
      }
   }

//Criar ou atualizar um usuário
const form = document.getElementById('form-usuario');

//Quando o formulário é enviado, não recarregamos a página
form.addEventListener('submit', async function (event) {
   event.preventDefault();

   //Coleta os dados do formulário
   const nome = document.getElementById('nome').value;
   const email = document.getElementById('email').value;
   const telefone = document.getElementById('telefone').value;

   const novoUsuario = {
      name: nome,
      email: email,
      phone: telefone
   };

   // Verifica se estamos editando um usuário existente
   try {
      if (editando) {
      //Requisição PUT: Envia os dados atualizados do usuário para a API, convertendo em JSON e envia no corpo da requisição, exibindo a resposta de sucesso.
      const resposta = await fetch(`https://jsonplaceholder.typicode.com/users/${idEditando}`, {
         method: 'PUT',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(novoUsuario)
      })

      const dado = await resposta.json();
      alert('Usuário atualizado com sucesso (simulado)!');
      //Limpa o formulário, muda o botão para "Criar Usuário" e volta ao estado inicial de criação
      form.reset();
      form.querySelector('button').textContent = 'Criar Usuário';
      editando = false;
      idEditando = null;
   } else {
      //Requisição POST: Se não estamos editando, criamos um novo usuário, convertendo em JSON e envia no corpo da requisição exibindo a resposta de sucesso.
      const resposta = await fetch('https://jsonplaceholder.typicode.com/users', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(novoUsuario)
      })

      const dadoCriado = await resposta.json();
      console.log('Usuário criado (simulado):', dadoCriado);
      alert('Usuário criado com sucesso!');

   }
   //Após criar ou editar um usuário, atualiza a lista de usuários e limpa o formulário
   buscarUsuarios();
   form.reset();

} catch(erro) {
   console.error('Erro ao criar usuário:', erro);
   alert('Erro ao criar usuário. Tente novamente.');
}
});

//Função para preencher o formulário com os dados do usuário
function editarUsuario(id, nome, email, telefone) {
   document.getElementById('nome').value = nome;
   document.getElementById('email').value = email;
   document.getElementById('telefone').value = telefone;

   // Muda o estado para edição
   editando = true;
   idEditando = id;

   // Atualiza o texto do botão
   const botao = form.querySelector('button');
   botao.textContent = 'Salvar alterações';
}

//Função para deletar usuário
async function deletarUsuario(id, botao) {
   // Confirmação antes de deletar
   if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

   try {
      //Requisição DELETE: Deleta o usuário da API
      const resposta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE'
   });

   // Verifica se a resposta foi bem-sucedida, remove o cartão do usuário
   if (resposta.ok) {
      alert('Usuário deletado com sucesso!');
      const userCard = botao.parentElement;
      userCard.remove();
   } else {
      alert('Erro ao tentar deletar usuário.');
   }
} catch(erro) {
   console.error('Erro ao tentar deletar usuário:', erro);
}
}
