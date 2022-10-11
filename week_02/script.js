/*
Week 2 Java script example. Used in week_02/index.html
*/

//immediately evoked function
//runs on loading, useful if you're only doing something once and doesn't need to be called again
(() => console.log("immediate"))()

let person = "Sam";
((name) => console.log("Hello "+name))(person)

//anonymous functions
// let anonFun = function() {
//     console.log("anonymous")
// };
//or, arrow function shortcut
let anonFun = () => console.log("anonymous")

let num = 100; //integer

function foo() {
    let num2 = 200 //only available w/in fn
};

foo();

function adder(x, y){
    console.log(x+y);
};

adder(1, 4);

let arr = ['foo', 123, ['bar', 'baz']];
//0-indexing
//can change contents, content type
arr[1] = 234;
//append item
arr.push('xyz');
//remove item (index to remove, number of items to delete)
arr.splice(2, 1); //removes just third item

//for loop over itmes ---> OF
for (let item of arr){ //uses let statement though
    console.log(item);
}

//loop over index ---> IN
for (let i in arr){
    console.log(i+" "+arr[i])
}

arr.forEach((item, i) => console.log(i+" "+item))

//object programming
// JSON means javascript object notation, so we use json format here
let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter",
}

//equivalent ways to access object attributes
console.log(obj1.name);
console.log(obj1["name"])

//change attributes
obj1.job = "Harrista"

for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}: ${value}`) //string literal = BACKTICK not quote, ${}
}

console.log("hello "+obj1["name"]+" "+num)
console.log(`hello ${obj1["name"]} ${num}`)

//iterator for loop
// these semicolons are ESSENTIAL
for (let i=0; i<10; i++) { // has ++
    console.log(i)
}

//if else
let x = 75

if (x>50) {
    console.log("up")
} else if (x > 5) {
    console.log("down")
} else {
    console.log("none")
}

// ternary operator
let y = (x > 50) ? "up" : "down";

//traverse DOM
let example = document.getElementById("example");
// find place in html

example.innerHTML += 'Hello world!'