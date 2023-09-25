import {faker} from '@faker-js/faker'

describe('Testes automaticos da API ServeRest', () => {

  let userId;
  let randomEmailCadastrar;
  let randomEmailAtualizar;
  let randomEmail;

  beforeEach(() => {
    if (!randomEmailCadastrar) {
      randomEmailCadastrar = faker.internet.email(); 
    }
    if (!randomEmailAtualizar) {
      randomEmailAtualizar = faker.internet.email(); 
    }
    randomEmail = faker.internet.email();
  });

  //Primeiro
  it('Cadastra um novo usuário', () => {
    const user = {
      nome: 'Nome do Usuário',
      email: randomEmailCadastrar,
      password: '12345',
      administrador: 'true'
    };
  
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: user,
    }).should(({ status, body }) => {
      expect(status).to.equal(201);
      expect(body.message).to.include('Cadastro realizado com sucesso');
      userId = body._id;
    });
  })

  //Segundo
  it('Cadastra usuário com e-mail igual ao primeiro', () => {
    const user = {
      nome: 'Nome do Usuário',
      email: randomEmailCadastrar, 
      password: '12345',
      administrador: 'true'
    };
  
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: user,
      failOnStatusCode: false,
    }).should(({ status, body }) => {
      expect(status).to.equal(400);
      expect(body.message).to.include('Este email já está sendo usado');
    });
  });

  //Terceiro
  it('Atualizar usuário cadastrado', () => {
    const user = {
      nome: 'Nome do Usuário',
      email: randomEmailAtualizar,
      //email: 'edu222@gmail.com',
      password: '12345',
      administrador: 'true'
    };
  
    cy.request({
      method: 'PUT',
      url: `https://serverest.dev/usuarios/${userId}`,
      body: user,
      //failOnStatusCode: false,
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.message).to.include('Registro alterado com sucesso');
      //expect(body._id).to.be.not.undefined;
    });
  })

  //Quarto
  // it('Atualizar usuário cadastrado com erro', () => {
  //   const user = {
  //     nome: 'Nome do Usuário',
  //     email: "beltrano@qa.com.br", 
  //     password: '12345',
  //     administrador: 'true'
  //   };
  
  //   cy.request({
  //     method: 'PUT',
  //     url: `https://serverest.dev/usuarios/${userId}`,
  //     body: user,
  //     failOnStatusCode: false,
  //   }).should(({ status, body }) => {
  //     expect(status).to.equal(400); 
  //     expect(body.message).to.include('Este email já está sendo usado');
  //   });
  // });

  //Quinto
  it('Buscar usuário cadastrado por ID', () => {
    cy.request({
      method: 'GET',
      url: `https://serverest.dev/usuarios/${userId}`,
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.nome).to.equal('Nome do Usuário');
      //expect(body.email).to.equal(randomEmailCadastrar); 
      expect(body.password).to.equal('12345');
    });
  })

  //Sexto
  it('Buscar usuário por email', () => {
    const emailToSearch = randomEmailAtualizar; 
  
    cy.request({
      method: 'GET',
      url: `https://serverest.dev/usuarios?email=${emailToSearch}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('usuarios').that.is.an('array');
  
      if (response.body.usuarios.length === 0) {
        cy.log('Nenhum usuário encontrado com o email especificado.');
      } else {
        const firstUser = response.body.usuarios[0]; 
        expect(firstUser).to.have.property('nome'); 
        expect(firstUser).to.have.property('password'); 
      }
    });
  });

  //Sétimo
  it('Buscar usuário por email inválido', () => {
    const emailInvalido = 'email_inexistente@exemplo.com'; 
  
    cy.request({
      method: 'GET',
      url: `https://serverest.dev/usuarios?email=${emailInvalido}`,
    }).should(({ status, body }) => {
      expect(status).to.equal(200); 
      expect(body).to.be.an('object'); 
      expect(body.usuarios).to.be.an('array');
      expect(body.usuarios).to.have.lengthOf(0);
    });
  });

  //Oitavo
  it('Buscar Administradores', () => {
    const is_administrador = true;
  
    cy.request({
      method: 'GET',
      url: `https://serverest.dev/usuarios?administrador=${is_administrador}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('usuarios').that.is.an('array');
      expect(response.body.usuarios.length).to.be.greaterThan(0);

      if (response.body.usuarios.length === 0) {
        cy.log('Nenhum Administrador encontrado.');
      }
    });
  });

  //Nono
  it('Deletar usuário cadastrado por ID', () => {
    cy.request({
      method: 'DELETE',
      url: `https://serverest.dev/usuarios/${userId}`,
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.message).to.contains('Registro excluído com sucesso');
    });
  });

  //Décimo
  it('Deletar mesmo usuário cadastrado por ID novamente', () => {
    cy.request({
      method: 'DELETE',
      url: `https://serverest.dev/usuarios/${userId}`,
    }).should(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body.message).to.contains('Nenhum registro excluído');
    });
  });

});