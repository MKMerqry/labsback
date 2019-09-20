
   module.exports = {
	getemail : (nombre,proyecto,fase,actividad) => {
        return '<!DOCTYPE html> '+
'<html lang="it"><head> '+
'<title>MerQry</title> '+
'<meta charset="utf-8"> '+
'<meta name="viewport" content="width=device-width"> '+
'<style type="text/css"> '+      
      '#ko_onecolumnBlock_3 .textintenseStyle a, #ko_onecolumnBlock_3 .textintenseStyle a:link, #ko_onecolumnBlock_3 .textintenseStyle a:visited, #ko_onecolumnBlock_3 .textintenseStyle a:hover{ '+
       'color: #ffffff; '+
        'color: ; '+
        'text-decoration: none; '+
        'font-weight: bold; '+
        'text-decoration: none '+
      '} '+
      
      '#ko_onecolumnBlock_3 .textlightStyle a, #ko_onecolumnBlock_3 .textlightStyle a:link, #ko_onecolumnBlock_3 .textlightStyle a:visited, #ko_onecolumnBlock_3 .textlightStyle a:hover{ '+
        'color: #3F3D33; '+
        'color: ; '+      
        'text-decoration: none; '+
        'font-weight: bold; '+
        'text-decoration: '+
      '} '+
      '</style> '+
  '<style type="text/css"> '+
    '#outlook a{padding:0;} '+
    '.ReadMsgBody{width:100%;} .ExternalClass{width:100%;} '+
    '.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;} '+
    'body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} '+
    'table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} '+
    'img{-ms-interpolation-mode:bicubic;} '+
    'body{margin:0; padding:0;} '+
    'img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;} '+
    'table{border-collapse:collapse !important;} '+
    'body{height:100% !important; margin:0; padding:0; width:100% !important;} '+
    '.appleBody a{color:#68440a; text-decoration: none;} '+
    '.appleFooter a{color:#999999; text-decoration: none;} '+

    '@media screen and (max-width: 525px) { '+
        'table[class="wrapper"]{ '+
          'width:100% !important; '+
          'min-width:0px !important; '+
        '} '+
        'td[class="mobile-hide"]{ '+
          'display:none;} '+
          'img[class="mobile-hide"]{ '+
            'display: none !important; '+
            '} '+
            'img[class="img-max"]{ '+
                'width:100% !important; '+
          'max-width: 100% !important; '+
          'height:auto !important; '+
        '} '+
        'table[class="responsive-table"]{ '+
          'width:100%!important; '+
        '} '+
        'td[class="padding"]{ '+
          'padding: 10px 5% 15px 5% !important; '+
        '} '+
        'td[class="padding-copy"]{ '+
          'padding: 10px 5% 10px 5% !important; '+
          'text-align: center; '+
        '} '+
        'td[class="padding-meta"]{ '+
          'padding: 30px 5% 0px 5% !important; '+
          'text-align: center; '+
        '} '+
        'td[class="no-pad"]{ '+
          'padding: 0 0 0px 0 !important; '+
        '} '+
        'td[class="no-padding"]{ '+
         'padding: 0 !important; '+
        '} '+
        'td[class="section-padding"]{ '+
          'padding: 10px 15px 10px 15px !important; '+
        '} '+
        'td[class="section-padding-bottom-image"]{ '+
          'padding: 10px 15px 0 15px !important; '+
        '} '+
        'td[class="mobile-wrapper"]{ '+
            'padding: 10px 5% 15px 5% !important; '+
        '} '+
        'table[class="mobile-button-container"]{ '+
            'margin:0 auto; '+
           'width:100% !important; '+
        '} '+
        'a[class="mobile-button"]{ '+
            'width:80% !important; '+
            'padding: 15px !important; '+
            'border: 0 !important; '+
            'font-size: 16px !important; '+
        '} '+
    '} '+
'</style> '+
'</head> '+
'<body style="margin: 0; padding: 0;" bgcolor="#ffffff" align="center"> '+
'<table border="0" cellpadding="0" cellspacing="0" width="100%" id="ko_headerBlock_5"> '+
    '<tbody><tr> '+
        '<td bgcolor="#dbe5f1" align="center" style="padding: 20px 15px 20px 15px;">'+  
                '<table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> '+
                    '<tbody><tr> '+
                        '<td> '+
                        '<table cellspacing="0" cellpadding="0" border="0" width="100%"> '+
                            '<tbody><tr> '+
                                '<td valign="top" style="padding: 0;" class="mobile-wrapper"> '+
                                    '<table border="0" cellpadding="0" cellspacing="0" width="30%" class="responsive-table" align="left"> '+
                                        '<tbody><tr> '+
                                            '<td bgcolor="#dbe5f1"> '+
                                            '<a target="_new" href=""><img alt="" image-droppable="" width="150" class="img-max" border="0" style="display: block; font-family: Helvetica, Arial, sans-serif; color: #3F3D33; font-size: 16px;" src="https://i.imgur.com/RakJy3R.png"></a></td> '+
                                        '</tr> '+
                                    '</tbody></table> '+
                                     '<table border="0" cellpadding="0" cellspacing="0" width="60%" class="responsive-table" align="right"> '+
                                        '<tbody><tr> '+
                                            '<td bgcolor="#dbe5f1" align="center"> '+
                                                '<table border="0" cellpadding="0" cellspacing="0"> '+
                                                    '<tbody><tr> '+
                                                        '<td align="center" style="padding: 10px 0 0 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33; text-decoration: none;"><span style="color: #3F3D33; text-decoration: none;"><strong>Actualización del Proyecto : '+proyecto+'</strong>&nbsp;</span></td> '+
                                                    '</tr> '+                                                  
                                                '</tbody></table> '+
                                            '</td> '+
                                        '</tr> '+
                                    '</tbody></table> '+
                                '</td> '+
                            '</tr> '+
                        '</tbody></table> '+
                        '</td> '+
                    '</tr> '+
               '</tbody></table> '+
        '</td> '+
    '</tr> '+
'</tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" id="ko_onecolumnBlock_3"> '+  
    '<tbody><tr class="row-a"> '+
        '<td bgcolor="#8db3e2" align="center" class="section-padding" style="padding-top: 30px; padding-left: 15px; padding-bottom: 30px; padding-right: 15px;"> '+
            '<table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table"> '+
                '<tbody><tr> '+
                    '<td> '+
                        '<table width="100%" border="0" cellspacing="0" cellpadding="0"> '+
                            '<tbody><tr> '+
                                '<td> '+
                                    '<table width="100%" border="0" cellspacing="0" cellpadding="0"> '+
                                        '<tbody><tr> '+
                                            '<td align="center" class="padding-copy" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33; padding-top: 0px;">'+nombre+', por medio del presente le informamos lo siguiente:</td> '+
                                        '</tr> '+
                                        '<tr> '+
                                            '<td align="center" class="padding-copy textlightStyle" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33;"><p><strong>En el Proyecto:'+proyecto+', de la Fase:'+fase+', se actualizo la siguiente Actividad:'+actividad+'</strong></p></td> '+
                                        '</tr> '+
                                    '</tbody></table> '+
                                '</td> '+
                            '</tr> '+

                            '<tr> '+
                                '<td> '+
                                    '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="mobile-button-container"> '+
                                        '<tbody><tr> '+
                                            '<td align="center" style="padding: 25px 0 0 0;" class="padding-copy"> '+
                                                '<table border="0" cellspacing="0" cellpadding="0" class="responsive-table"> '+
                                                    '<tbody><tr> '+
                                                        '<td align="center"><a target="_new" class="mobile-button" style="display: inline-block; font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: normal; color: #ffffff; text-decoration: none; background-color: #0c0c0c; padding-top: 15px; padding-bottom: 15px; padding-left: 25px; padding-right: 25px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-bottom: 3px solid #4c4c4c;" href="https://projects.merqry.mx">Show More →</a></td> '+
                                                    '</tr> '+
                                                '</tbody></table> '+
                                            '</td> '+
                                        '</tr> '+
                                    '</tbody></table> '+
                                '</td> '+
                            '</tr> '+
                      '</tbody></table> '+
                    '</td> '+
                '</tr> '+
            '</tbody></table> '+
        '</td> '+
    '</tr> '+
    
'</tbody></table> '+
'<table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 500px;" id="ko_footerBlock_2"> '+
    '<tbody><tr> '+
        '<td bgcolor="#dbe5f1" align="center"> '+
            '<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center"> '+
                '<tbody><tr> '+
                    '<td style="padding: 20px 0px 20px 0px;"> '+
                        '<table width="500" border="0" cellspacing="0" cellpadding="0" align="center" class="responsive-table"> '+
                            '<tbody><tr> '+
                                '<td align="center" valign="middle" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33;"> '+
                                    '<span class="appleFooter" style="color: #3F3D33;">power by Trus City International</span> '+
                                '</td> '+
                            '</tr> '+
                        '</tbody></table> '+
                    '</td> '+
                '</tr> '+
            '</tbody></table> '+
        '</td> '+
    '</tr> '+
'</tbody></table> '+
'</body></html>';
    },

}   