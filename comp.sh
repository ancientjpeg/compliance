#!/bin/sh

f0=./src/lib/testData/docxParserTestData.docx
f1=./src/lib/testData/docxParserOutData.docx

tf0=/tmp/test_data
tf1=/tmp/out_data

function extract() {
  unzip -j "$1" word/document.xml
  xmllint --format document.xml > $2
  rm document.xml
}

extract $f0 $tf0
extract $f1 $tf1

diff --color $tf0 $tf1
