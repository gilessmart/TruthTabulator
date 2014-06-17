(function () {

    function getTruthTable (expression) {
        var identifiers;

        function getUniqueIdentifiers () {
            var identifiers = expression.match(/[a-zA-Z_$][0-9a-zA-Z_$]*/g),
                uniqueIdentifiers = [];

            identifiers.forEach(function (identifier) {
                if (!uniqueIdentifiers.some(function (uniqueIdentifier) {
                    return uniqueIdentifier === identifier;
                })) {
                    uniqueIdentifiers.push(identifier);
                }
            });

            return uniqueIdentifiers;
        }

        function getRows () {
            var rowCount = Math.pow(2, identifiers.length),
                i = 0,
                rows = [];

            for (; i < rowCount; i++) {
                rows.push(getRow(i));
            }

            return rows;
        }

        function getRow (rowIndex) {
            var inputs,
                binaryString = padLeft(rowIndex.toString(2), identifiers.length, '0');

            inputs = identifiers.map(function (identifier, identifierIndex) {
                var binaryChar = binaryString.charAt(identifierIndex);
                return {
                    name: identifier,
                    value: !!parseInt(binaryChar)
                };
            });

            return {
                inputs: inputs,
                result: getResult(inputs)
            };
        }

        function padLeft (inputString, minLength, padding) {
            var result = '' + inputString;

            while (result.length < minLength) {
                result = padding + result;
            }

            return result;
        }

        function getResult (inputs) {
            var code = '',
                result;

            inputs.forEach(function (input) {
                code += 'var ' + input.name + '=' + input.value + ';';
            });
            code += 'return ' + expression + ';';

            try {
                result = (new Function(code))();
            }
            catch (error) {
                result = error;
            }

            return result;
        }

        identifiers = getUniqueIdentifiers();

        return {
            identifiers: identifiers,
            expressionText: expression,
            rows: getRows()
        };
    }

    $(document).ready(function () {
        var expressionBox = $('#expressionBox'),
            startButton = $('#startButton'),
            identifiersList = $('#identifiersList'),
            truthTableElement = $('#truthTable');

        startButton.click(function () {
            var expression = expressionBox.val(),
                truthTable = getTruthTable(expression);

            setResult(truthTable);
        });

        function setResult (truthTable) {
            var tableHeader = $('<thead />'),
                tableBody = $('<tbody />');

            truthTableElement.empty();
            addHeaders(truthTable.identifiers, truthTable.expressionText, tableHeader);

            truthTable.rows.forEach(function (row) {
                addRow(row, tableBody);
            });

            truthTableElement.append(tableHeader);
            truthTableElement.append(tableBody);
        }

        function addHeaders (identifiers, expression, tableHeader) {
            identifiers.forEach(function (identifier) {
                tableHeader.append($('<th />').text(identifier));
            });

            tableHeader.append($('<th />').text(expression));
        }

        function addRow(rowData, tableBody) {
            var tableRow,
                resultCell;

            tableRow = $('<tr />');

            rowData.inputs.forEach(function (input) {
                var tableCell = $('<td />').text(input.value);
                tableRow.append(tableCell);
            });

            resultCell = $('<td />').text(rowData.result);

            tableRow.append(resultCell);
            tableBody.append(tableRow);
        }
    });

})();
