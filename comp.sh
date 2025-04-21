#!/bin/sh

f0=./src/lib/testData/docxParserTestData.docx
f1=./src/lib/testData/docxParserOutData.docx

tf0=/tmp/test_data
tf1=/tmp/out_data


function extract() {
  unzip -j "$1" word/document.xml
  mv document.xml "$2"
  # fold -w 80 document.xml > "$2"
  # rm document.xml
}

extract $f0 $tf0
extract $f1 $tf1

# # egrep -o '<w:t.*?>.*?<.*?>' "$tf1"
# sed -E -I '.bak' 's|(<w:t[^>]*>)([^<]*)(</w:t>)|\1\2AND\3|g' "$tf1"
# diff -u ${tf1}.bak ${tf1} | delta
# exit 0

diff -u $tf0 $tf1 | delta
