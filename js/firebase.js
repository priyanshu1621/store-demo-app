// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, child, update, get  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, setDoc, getDoc, addDoc, collection, getFirestore  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmQibwMfgVpUktbgotPS66MJzEUFk1f-c",
    authDomain: "auth-demo-7a277.firebaseapp.com",
    databaseURL: "https://auth-demo-7a277-default-rtdb.firebaseio.com",
    projectId: "auth-demo-7a277",
    storageBucket: "auth-demo-7a277.appspot.com",
    messagingSenderId: "499405489476",
    appId: "1:499405489476:web:83bea5e3496b4d84f44311"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
const auth = getAuth();
const db = getFirestore(app);
var product = 0;

var tbody = document.getElementById('productbody');

window.onload = getAllData;


var signupaction = document.getElementById('signupbtn');
if (signupaction) {
    signupaction.addEventListener('click', (e) => {

        var email = document.getElementById('email').value;
        var password = document.getElementById('pass').value;
        var username = document.getElementById('name').value;
        var isSeller = document.getElementById('register-as-seller');

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // Add a new document in collection "cities"
                if (isSeller.checked) {
                    setDoc(doc(db, "users", user.uid), {
                        username: username,
                        email: email,
                        type: "Seller"
                    });
                }
                else {
                    setDoc(doc(db, "users", user.uid), {
                        username: username,
                        email: email,
                        type: "Buyer"
                    });
                }

                sendEmailVerification(user)
                    .then(() => {
                        // Email verification sent!
                        let msg = 'An email verification link has been sent to ' + user.email;

                        alert(msg);
                        location.reload();
                    });
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

//     createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
// // Signed in 
//     const user = userCredential.user;
//     alert('Verify Your Email Address.');
//     location.reload();
// // ...
// })
// .catch((error) => {
// const errorCode = error.code;
// const errorMessage = error.message;

// alert(errorMessage);
// // ..
// });
// });

var singinaction = document.getElementById('signin');
if(singinaction){
    singinaction.addEventListener('click', (e) => {
    var email = document.getElementById('your_email').value;
    var password = document.getElementById('your_pass').value;




    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            getDoc(doc(db, "users", user.uid)).then(docSnap => {
                if (docSnap.exists()) {
                    if (!user.emailVerified) {
                        alert("Please Verify your email address to login!!");
                        location.reload();
                    }
                    else if (user) {
                        if (docSnap.data().type === 'Buyer') {
                            location.replace('homepage_Buyer.html');
                        }
                        else {
                            location.replace('homepage_Seller.html');
                        }
                    }
                    console.log("Document data:", docSnap.data());
                } else {
                    alert("Something Bad Happened!! please try re-login");
                    console.log("No such document!");
                }
            });
            // const docRef = doc(db, "users", user.uid);
            // const docSnap = getDoc(docRef);
            // console.log(docSnap);

            // if (docSnap.exists) {
            //   console.log("Document data:", docSnap.data());
            // } else {
            //   // doc.data() will be undefined in this case
            //   console.log("No such document!");
            // }

            // 
            // ...
        })

        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});
}

// $(function () {
//     $('#addproductbtn').on('click', function (event) {
//         alert("clicked");
//         event.preventDefault();
//     });

// });

document.getElementById('addproductbtn').addEventListener('click', (e) => {
    var product_name = document.getElementById('product_name').value;
    var product_description = document.getElementById('product_description').value;
    var product_categorie = document.getElementById('product_categorie').value;
    var product_price = document.getElementById('product_price').value;
    

    var uid = "id" + Math.random().toString(16).slice(2);
    
    if(product_name == "" || product_description == "" || product_categorie == "" || product_price == "" ){
        return;
    }else{
        writeNewPost(uid, product_name, product_description, product_categorie, product_price);
    // ReadData(product_name, product_description, product_categorie, product_price);

    getAllData();
    }
    

});

function writeUserData(product_name, product_description, product_categorie, product_price) {
    const db = getDatabase();
    set(ref.push(db, 'Products/product'), {
        product_name: product_name,
        product_description: product_description,
        product_categorie: product_categorie,
        product_price: product_price
    });
}

function writeNewPost(uid, product_name, product_description, product_categorie, product_price) {
    const db = getDatabase();
  
    // A post entry.
    const postData = {
        uid: uid,
        product_name: product_name,
        product_description: product_description,
        product_categorie: product_categorie,
        product_price: product_price
    };
  
    // Get a key for a new Post.
    const newPostKey = push(child(ref(db), 'product')).key;
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/products/' + newPostKey] = postData;
    updates['/user-product/' + uid + '/' + newPostKey] = postData;
  
    return update(ref(db), updates);
  }

// function ReadData(product_name, product_description, product_categorie, product_price){
//     var database = getDatabase();
//     database.ref().once('value', function(snapshot){
//         if(snapshot.exists()){
//             var content = '';
//             snapshot.forEach(function(data){
//                 var val = data.val();
//                 content +='<tr>';
//                 content += '<td>' + val.product_name + '</td>';
//                 content += '<td>' + val.product_description + '</td>';
//                 content += '<td>' + val.product_categorie + '</td>';
//                 content += '<td>' + val.product_price + '</td>';
//                 content += '</tr>';
//             });
//             $('#buyerproductstable').append(content);
//         }
//     });
// }

function getAllData(){
    const db = getDatabase();
    const dbref = ref(db);
    get(child(dbref, "products"))
    .then((snapshot) => {
        var products = [];
        snapshot.forEach(childSnapshot => {
            products.push(childSnapshot.val());
            //AddProductsToTable(products);
            AddProductToTable(products)
            console.log(products);
        });
    });
}

function AddItemToTable(product_categorie, product_description, product_name, product_price){
    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
           
    td1.innerHTML= ++product;
    td2.innerHTML= product_name;
    td3.innerHTML= product_description;
    td4.innerHTML= product_categorie;
    td5.innerHTML= product_price;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);

    tbody.appendChild(trow);
}

function AddProductToTable(TheProduct ){
    product = 0;
 tbody.innerHTML="";
 TheProduct.forEach((element) => {
    AddItemToTable( element.product_categorie ,element.product_description ,element.product_name  , element.product_price);
 });
}