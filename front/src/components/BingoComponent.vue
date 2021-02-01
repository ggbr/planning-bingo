<template>
    <div class="container">
        <center>
            <div class="columns">
             
                <div class="column">
                    <div v-if="admin == 1">
                        <h1>Painel admin</h1>

                        <h2>
                            Lista de ADM
                        </h2>
                        <ul>
                            <li v-for="user in list_admin" v-bind:key="user">
                                    {{user}}
                            </li>
                        </ul>
                        <hr>

                        <button v-if="result == false" v-on:click="setResult()"  class="button is-primary" > Bingar </button>
                        <button v-if="result == true" v-on:click="setResult()" class="button is-danger" > Des Bingar </button>
                    </div>
                    <center>
                        <table class="table">

                            <tr v-for="(cols, r) in getTable()" v-bind:key="r">
                                <td v-for="(col, c) in cols" v-on:click="addBingo(r,c)" v-bind:key="c">

                                {{renderTitle(r,c)}}
                                <br>

                                    <div v-for="(person, id) in list_person"  v-bind:key="id">
                                        
                                        <span v-show="validPersonPosition(person,r,c)" :class="'dot p'+id " data-tooltip="Tooltip Text">
                                            <center>
                                                {{person.name[0]}}
                                            </center>
                                        </span>
                                    </div>
                                    <!--
                                    <span v-show="showBingo(r,c)" :class="'dot p' + getClassBingo(r,c) "></span>
                                    -->
                                </td>
                            </tr>


                        </table>
                    </center>

                    
                </div>
            </div>
        </center>

    </div>
</template>

<script>
const io = require("socket.io-client");

    export default {
    name: 'BingoComponent',
        props: {admin: Number},
        data: function() {
            return  {
                clientSocket : null,
                result : false,
                list_admin: [],
                list_person: [],
                person: null,
                list_player: [

                ],
                table: [
                        [ [], [], [], [], []],
                        [ [], [], [], [], []],
                        [ [], [], [], [], []]
                ]
            }
        },

        mounted() {
            this.name = prompt("Qual seu nome ?", "Ex: Jalos");
            
            this.startSocket();
            
            if(this.admin == 1){
                this.addAdmin(this.name)

            }else{
                this.addPerson(this.name)
            }

            
        },
        
        methods: {
            setResult(){
                this.clientSocket.emit('setResult', !this.result);
            },
            validPersonPosition(person,r,c){
                let position = person.position;
                let valid = false;

                if(position[0] == r &&  position[1] == c){
                    valid =  true;
                }

                if(this.admin == 1 || this.result == true){
                    return valid;
                } 


                if(this.name != person.name){
                        return false
                }

                return valid;




              
            },
            clearTable(){
                this.table = [
                        [ [], [], [], [], []],
                        [ [], [], [], [], []],
                        [ [], [], [], [], []]
                ];
            },
            setListInTable(){
                for(var i = 0; i < this.list_person.length; i++){
                    let person = this.list_person[i];

                    let position = this.list_person[i].position;

                    this.table[position[0]][position[1]].push(person.name) 
                }
            },
            addAdmin(name){
                //let local =  this;
                console.log("add admin")
                this.clientSocket.emit('addAdmin', name);
            },           
            startSocket() {
                const socket = io('http://23.22.89.145:5554');
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                console.log('http://23.22.89.145:5554')
                this.clientSocket = socket;

                let local = this;

                socket.on("updateAdmin", (data) => {
                    console.log("<<<<<<<<");

                    console.log(data)
                    console.log(data.persons)

                    local.list_admin = data.admin;
                    local.list_person = data.persons;
                    local.result = data.result;

                    console.log("$$$$$$$$$$$");

                    local.clearTable();
                    local.setListInTable();
                    

                });
            },
            getTable: function(){
                return this.table;
            },

            addtable: function(row, col){
                this.table[row][col] = this.person.bingo;
            },
            addBingo: function(row, col){
                if(this.admin == 1 || this.result == true){
                    return;
                }
                this.clearTable();
                this.addtable(row, col);
                this.sendServerBingo(row, col);
            },
            sendServerBingo: function(row, col){
                let bingo = {
                    name: this.person.name,
                    position: [row, col]
                };

                this.clientSocket.emit('clientSendBingo', bingo);
            },
            addPerson: function (name) {
                this.person = {
                    name: name,
                    bingo: 'p'  + this.list_player.length
                };
                this.list_player.push(this.person);
            },
            renderTitle: function (row,col) {

                let  html = (row == 0? 'A':(row == 1? 'B': 'C')) + (col+1);
                return html;
            },
            showBingoAdmin(row, col){
                if(this.table[row][col] != null){
                    return true;
                }

                return false;
            },
            showBingo(row, col){
                if(this.table[row][col] != null){
                    return true;
                }

                return false;
            },

            getClassBingo(row, col){
                return this.table[row][col];
            }
        }
    }
</script>
<style scoped>
    table{
        width: 500px;
        height: 300px;
        box-shadow: 5px 10px 10px #888888;
    }
    td {
        height: 100px;
        width: 100px;
        border: 2px solid #2c3e50;
        transition: background-color 0.6s;
    }

    td:hover {
        height: 100px;
        width: 100px;
        background-color:  #74b9ff;
        transition: background-color 0.6s;

    }
    .dot {
        height: 25px;
        width: 25px;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 1px 2px 2px #888888;

    }

    .p0 {
        background-color: #bbb;
    }

    .p1 {
        background-color: #1abc9c;
    }

    .p2 {
        background-color: #f1c40f;
    }

    .p3 {
        background-color: #3498db;
    }
    .p4 {
        background-color: #9b59b6;
    }
    .p5 {
        background-color: #34495e;
    }
    .p6 {
        background-color: #e67e22;
    }
    .p7 {
        background-color: #e74c3c;
    }

    .p8 {
        background-color: #16a085;
    }

    .p9 {
        background-color: #7f8c8d;
    }

    .p10 {
        background-color: #c0392b;
    }

    .p11 {
        background-color: #ecf0f1;
    }

    .p12 {
        background-color: #3498db;
    }

    .p13 {
        background-color: #2ecc71;
    }
</style>
