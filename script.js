class hojaDeCalculo {
    constructor(filas, columnas, div) {
        this.filas = filas;
        this.columnas = columnas;
        this.div = this.generarTabla(div);
    }

    generarTabla(div) {
        let tabla = document.createElement("table");
        tabla.id = 'tabla';
        let tblBody = document.createElement("tbody");
        for (let fila = 0; fila < this.filas; fila++) {
            let hilera = document.createElement("tr");
            for (let columna = 0; columna < this.columnas; columna++) {
                let celda = document.createElement("td");
                celda.style = 'min-width:100px';
                let divTd = document.createElement('div');
                divTd.contentEditable = "true";
                divTd.dataset.direccion = `${fila}${columna}`

                divTd.addEventListener('keypress', function (e) {
                    this.teclaPresionada(e);
                }.bind(this));

                divTd.addEventListener('dblclick', function (e) {
                    this.mostrarFuncion(e);
                }.bind(this));

                divTd.addEventListener('focusout', function (e) {
                    this.CambiarAlgunDato(e)
                }.bind(this));

                celda.appendChild(divTd);
                hilera.appendChild(celda);
            }
            tblBody.appendChild(hilera);
        }
        tabla.appendChild(tblBody);
        div.appendChild(tabla);
        tabla.setAttribute("border", "2");
        return div;
    }

    CambiarAlgunDato() {
        const tabla = document.getElementById('tabla');
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {

                const target = tabla.rows[i].cells[j].querySelector('div');
                const funcion = tabla.rows[i].cells[j].querySelector('div').dataset?.funcion;
                if (funcion !== undefined) {
                    this._ejecutarFuncion(target, funcion);
                }
            }
        }
    }

    teclaPresionada(e) {
        if (e.which === 13) {
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            const funcion = e.target.innerHTML;;
            this._ejecutarFuncion(e.target, funcion);
        }
    }

    _ejecutarFuncion(e, funcion) {
        let parseado;
        try {
            parseado = JSON.parse(funcion);
        } catch (err) {
            alert("solo numeros o funciones");
            return;
        }

        if (typeof parseado === 'object') {
            const { operacion: tipo, celda1, celda2 } = parseado;
            const tabla = document.getElementById('tabla');
            const celda1Num = +tabla.rows[celda1[0]].cells[celda1[1]].querySelector('div').innerHTML;
            const celda2Num = +tabla.rows[celda2[0]].cells[celda2[1]].querySelector('div').innerHTML;

            if (tipo.toLowerCase() === 'suma') {
                e.dataset.funcion = `{"operacion":"suma","celda1":[${celda1[0]},${celda1[1]}],"celda2":[${celda2[0]},${celda2[1]}]}`
                e.innerHTML = celda1Num + celda2Num;
            }
            if (tipo.toLowerCase() === 'resta') {
                e.dataset.funcion = `{"operacion":"resta","celda1":[${celda1[0]},${celda1[1]}],"celda2":[${celda2[0]},${celda2[1]}]}`
                e.innerHTML = celda1Num - celda2Num;
            }
            if (tipo.toLowerCase() === 'multiplicacion') {
                e.dataset.funcion = `{"operacion":"multiplicacion","celda1":[${celda1[0]},${celda1[1]}],"celda2":[${celda2[0]},${celda2[1]}]}`
                e.innerHTML = celda1Num * celda2Num;
            }
            if (tipo.toLowerCase() === 'division') {
                e.dataset.funcion = `{"operacion":"division","celda1":[${celda1[0]},${celda1[1]}],"celda2":[${celda2[0]},${celda2[1]}]}`
                e.innerHTML = celda1Num / celda2Num;
            }
            return;
        }
        if (typeof parseado === 'number') {
            return;
        }
    }

    mostrarFuncion(e) {
        const funcion = e.target.dataset?.funcion;
        if (funcion === undefined) {
            return;
        }
        e.target.innerHTML = funcion;
    }
}

//Codigo de StackOverFlow para evitar el pegado con estilo.
document.addEventListener("paste", function (e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand("insertHTML", false, text);
});

const divGeneral = document.querySelector(".hojaDeCalculo");
const hoja1 = new hojaDeCalculo(10, 10, divGeneral);