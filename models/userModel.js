const bcrypt = require("bcryptjs");
const { response } = require("express");
const saltRounds = 10;

module.exports = (_db) => {
  db = _db;
  return UserModel;
};

class UserModel {
  //SAUVEGARDE UTILISATEUR
  // static est une fonction version class en poo
  // en argument on passe req qui vient du front ce sont les donnée que l'utilisateur rentre lorsqyu'il ecrit dans les formulaires pour creer un compte
  static async saveOneUser(req) {
    //ici on crée des racourcis des datas reçues de l'utilisateur qui sont dans req.body
    /* const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email */

    // ici on fait un racourci on destructure et on affecte req.body
    const { firstName, lastName, password, email } = req.body;

    console.log("lastName", lastName);
    console.log("email", email);
    console.log("firstName", firstName);
    console.log("password", password);

    // verifier si le mail est utiliser ou pas on fait une requete sql qui cherche dans tous lers users
    const user = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    //console.log('user', user)

    // si il y a un utilisateur avec le mail fourni en req alors
    if (user.length) {
      // on envoit un message d'erreur
      return "email déjà utilisé";
    } else {
      //ici on stock dans une constante  et on crypte le mot de passe
      const cryptedPassword = await bcrypt.hash(password, saltRounds);

      // on enregistre vraiment l'utilisateur si il n'ay a pas l'email en bdd
      return (
        db
          //.query() est une methode qui permet de faire la requete sql entre les parenthèses
          .query(
            "INSERT INTO users (firstName, lastName, email, cryptedPassword, accountCreationDate) VALUES(?, ?, ?, ?, NOW())",
            [firstName, lastName, email, cryptedPassword]
          )
          //en cas de succès il retourne les données
          .then((result) => {
            console.log("result", result);
            return result;
          })
          .catch((err) => {
            console.log("err", err);
            return err;
            // si il ne trouve pas il renvoit l'erreur
          })
      );
    }
  }

  //ici on recup un utilisateur par son email donc on lui passe en paramètre de la fonction email
  static getOneUserByEmail(email) {
    return db
      .query("SELECT * FROM users WHERE email = ?", [email])
      .then((response) => {
        console.log("response getOneUserByEmail", response);
        return response;
        //en cas de succès il retourne les données
      })
      .catch((err) => {
        console.log("err", err);
        return err;
        // si il ne trouve pas il renvoit l'erreur
      });
  }

  //ici on recup un utilisateur par son id donc on a besoin de lui passer en argument "id" car il a besoin de cet data qui vien du front
  static getOneUserById(id) {
    return db
      .query("SELECT * FROM users WHERE id=?", [id])
      .then((response) => {
        // dans le cas ou il y a les données il va renvoyer les données via response
        console.log("response1", response);
        return response;
      })

      .catch((err) => {
        //si il il y a un problème dans la bdd il va revoyer l'erreur
        console.log("err", err);
        return err;
      });
  }

  // MODIFIER UTILISATEUR : en paramettre de la fonction on a besoin de la requete du front et de id de l'utilisateur et la require (requete)
  static updateOneUser(req, userId) {
    return (
      db
        .query(
          "UPDATE users SET firstname = ?, lastName = ?, address = ?, zip = ?, city = ?, phone = ? WHERE id = ?",
          [firstName, lastName, address, zip, city, phone, userId]
        )

        .then((response) => {
          // on passe en argument la response de la requete
          // en cas de succès on retourne la response donc toutes les données demandées dans la requete
          return response;
        })
        // on passe une callback en argument de la méthode .catch()
        .catch((err) => {
          // en cas d'erreur si la bdd n'a rien trouvé il renvoit erreur
          return err;
        })
    );
  }

  //??????
  static updateConnexion(id) {
    //que fait cette partie ?
  }
}
