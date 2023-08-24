import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
  DataKanban,
  DataProduct,
  DataSloc,
  DataWarehouse,
} from 'src/config/GetDataApi';
import { cilCheck, cilFilter, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { getUrlKanban, getUrlSloc } from 'src/config/Api';
import axios from 'axios';
import "./cssPrintKanban.css"


const MasterKanban = () => {
  const products = DataProduct();
  const slocs = DataSloc();
  const warehouses = DataWarehouse();
  const kanbans = DataKanban();

  const [qrValue, setQRValue] = useState('');
  const [dataQrCode, setDataQrCode] = useState([]);
  const [profuctFiltered, setProductFiltered] = useState([]);

  const [editQrCode, setEditQrCode] = useState(false);
  const [dataFormQrCode, setDataFromQrCode] = useState([]);
  const [search, setSearch] = useState('');

  const pdf = new jsPDF();
  const refPartCode = useRef(null);

  const refForm = useRef(null);
  const refTo = useRef(null);

  const handleCreateQrCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(getUrlKanban, {
        part_name: dataQrCode.part_name,
        part_code: dataQrCode.part_code,
        qty: dataQrCode.qty,
        from: dataQrCode.from,
        to: dataQrCode.to,
      });
      setQRValue(response.response);
      refPartCode.current.clear();
      refTo.current.clear();
      setDataQrCode([]);
      setQRValue('');
      refForm.current.clear();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFromQrCode = () => {
    refPartCode.current.clear();
    refTo.current.clear();
    setDataQrCode([]);
    setQRValue('');
    refForm.current.clear();
  };

  const handQrCodeById = async (item) => {
    try {
      setEditQrCode(true);
      setDataFromQrCode({
        part_no: item.part_no,
        part_name: item.part_name,
        qty: item.qty,
        id: item.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSloc = async (id) => {
    try {
      await axios.delete(`${getUrlKanban}?id=${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const [cekForm, setCekForm] = useState(false);
  const handleFilterProduct = (e) => {
    if (cekForm) {
      refPartCode.current.clear();
      refTo.current.clear();
      setDataQrCode([]);
      setQRValue('');
      setCekForm(false);
    } else {
     /*  const cekExitProduct = products.filter((product) =>
        warehouses
          .filter((warehouse) => warehouse.sloc_code.includes(e))
          .map((filteredWarehouse) => filteredWarehouse.part_code)
          .some((result) =>
            String(result.part_code).includes(String(product.no)),
          ),
      ); */

      const getProductInWarehouse = warehouses.filter(warehouse => 
         warehouse.sloc_code.toLowerCase().includes(e.toLowerCase()) )
      setCekForm(true);
      setProductFiltered(getProductInWarehouse);
    }
  };

  const [kanbanById, setKanbanById] = useState([]);
  const handlePreviewKanban = (item) => {
    setQRValue(
      `${item.part_name}|${item.part_code}|${item.qty}|${item.from}|${item.to}`,
    );
    setKanbanById(item);
  };

  const handleClosePreviewKanban = () => {
    setQRValue([]);
    setKanbanById([]);
  };


  const kanbanRef = useRef();
  const qrCodeRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=420,height=297'); // A5 landscape size
    const printDocument = printWindow.document;
    printDocument.open();
    printDocument.write(`<html xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns="http://www.w3.org/TR/REC-html40">
    
    <head>
    <meta name="Excel Workbook Frameset">
    <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
    <meta name=ProgId content=Excel.Sheet>
    <meta name=Generator content="Microsoft Excel 15">
    <link rel=File-List href="Kanban%20Demo_files/filelist.xml">
    <![if !supportTabStrip]>
    <link id="shLink" href="Kanban%20Demo_files/sheet001.htm">
    <link id="shLink" href="Kanban%20Demo_files/sheet002.htm">
    <link id="shLink" href="Kanban%20Demo_files/sheet003.htm">
    <link id="shLink" href="Kanban%20Demo_files/sheet004.htm">
    <link id="shLink" href="Kanban%20Demo_files/sheet005.htm">
    
    <link id="shLink">
    
    <script language="JavaScript">
    <!--
     var c_lTabs=5;
    
     var c_rgszSh=new Array(c_lTabs);
     c_rgszSh[0] = "Data";
     c_rgszSh[1] = "Kanban";
     c_rgszSh[2] = "tmast_product";
     c_rgszSh[3] = "WH";
     c_rgszSh[4] = "Sloc";
    
    
    
     var c_rgszClr=new Array(8);
     c_rgszClr[0]="window";
     c_rgszClr[1]="buttonface";
     c_rgszClr[2]="windowframe";
     c_rgszClr[3]="windowtext";
     c_rgszClr[4]="threedlightshadow";
     c_rgszClr[5]="threedhighlight";
     c_rgszClr[6]="threeddarkshadow";
     c_rgszClr[7]="threedshadow";
    
     var g_iShCur;
     var g_rglTabX=new Array(c_lTabs);
    
    function fnGetIEVer()
    {
     var ua=window.navigator.userAgent
     var msie=ua.indexOf("MSIE")
     if (msie>0 && window.navigator.platform=="Win32")
      return parseInt(ua.substring(msie+5,ua.indexOf(".", msie)));
     else
      return 0;
    }
    
    function fnBuildFrameset()
    {
     var szHTML="<frameset rows=\"*,18\" border=0 width=0 frameborder=no framespacing=0>"+
      "<frame src=\""+document.all.item("shLink")[4].href+"\" name=\"frSheet\" noresize>"+
      "<frameset cols=\"54,*\" border=0 width=0 frameborder=no framespacing=0>"+
      "<frame src=\"\" name=\"frScroll\" marginwidth=0 marginheight=0 scrolling=no>"+
      "<frame src=\"\" name=\"frTabs\" marginwidth=0 marginheight=0 scrolling=no>"+
      "</frameset></frameset><plaintext>";
    
     with (document) {
      open("text/html","replace");
      write(szHTML);
      close();
     }
    
     fnBuildTabStrip();
    }
    
    function fnBuildTabStrip()
    {
     var szHTML=
      "<html><head><style>.clScroll {font:8pt Courier New;color:"+c_rgszClr[6]+";cursor:default;line-height:10pt;}"+
      ".clScroll2 {font:10pt Arial;color:"+c_rgszClr[6]+";cursor:default;line-height:11pt;}</style></head>"+
      "<body onclick=\"event.returnValue=false;\" ondragstart=\"event.returnValue=false;\" onselectstart=\"event.returnValue=false;\" bgcolor="+c_rgszClr[4]+" topmargin=0 leftmargin=0><table cellpadding=0 cellspacing=0 width=100%>"+
      "<tr><td colspan=6 height=1 bgcolor="+c_rgszClr[2]+"></td></tr>"+
      "<tr><td style=\"font:1pt\">&nbsp;<td>"+
      "<td valign=top id=tdScroll class=\"clScroll\" onclick=\"parent.fnFastScrollTabs(0);\" onmouseover=\"parent.fnMouseOverScroll(0);\" onmouseout=\"parent.fnMouseOutScroll(0);\"><a>&#171;</a></td>"+
      "<td valign=top id=tdScroll class=\"clScroll2\" onclick=\"parent.fnScrollTabs(0);\" ondblclick=\"parent.fnScrollTabs(0);\" onmouseover=\"parent.fnMouseOverScroll(1);\" onmouseout=\"parent.fnMouseOutScroll(1);\"><a>&lt</a></td>"+
      "<td valign=top id=tdScroll class=\"clScroll2\" onclick=\"parent.fnScrollTabs(1);\" ondblclick=\"parent.fnScrollTabs(1);\" onmouseover=\"parent.fnMouseOverScroll(2);\" onmouseout=\"parent.fnMouseOutScroll(2);\"><a>&gt</a></td>"+
      "<td valign=top id=tdScroll class=\"clScroll\" onclick=\"parent.fnFastScrollTabs(1);\" onmouseover=\"parent.fnMouseOverScroll(3);\" onmouseout=\"parent.fnMouseOutScroll(3);\"><a>&#187;</a></td>"+
      "<td style=\"font:1pt\">&nbsp;<td></tr></table></body></html>";
    
     with (frames['frScroll'].document) {
      open("text/html","replace");
      write(szHTML);
      close();
     }
    
     szHTML =
      "<html><head>"+
      "<style>A:link,A:visited,A:active {text-decoration:none;"+"color:"+c_rgszClr[3]+";}"+
      ".clTab {cursor:hand;background:"+c_rgszClr[1]+";font:9pt Arial;padding-left:3px;padding-right:3px;text-align:center;}"+
      ".clBorder {background:"+c_rgszClr[2]+";font:1pt;}"+
      "</style></head><body onload=\"parent.fnInit();\" onselectstart=\"event.returnValue=false;\" ondragstart=\"event.returnValue=false;\" bgcolor="+c_rgszClr[4]+
      " topmargin=0 leftmargin=0><table id=tbTabs cellpadding=0 cellspacing=0>";
    
     var iCellCount=(c_lTabs+1)*2;
    
     var i;
     for (i=0;i<iCellCount;i+=2)
      szHTML+="<col width=1><col>";
    
     var iRow;
     for (iRow=0;iRow<6;iRow++) {
    
      szHTML+="<tr>";
    
      if (iRow==5)
       szHTML+="<td colspan="+iCellCount+"></td>";
      else {
       if (iRow==0) {
        for(i=0;i<iCellCount;i++)
         szHTML+="<td height=1 class=\"clBorder\"></td>";
       } else if (iRow==1) {
        for(i=0;i<c_lTabs;i++) {
         szHTML+="<td height=1 nowrap class=\"clBorder\">&nbsp;</td>";
         szHTML+=
          "<td id=tdTab height=1 nowrap class=\"clTab\" onmouseover=\"parent.fnMouseOverTab("+i+");\" onmouseout=\"parent.fnMouseOutTab("+i+");\">"+
          "<a href=\""+document.all.item("shLink")[i].href+"\" target=\"frSheet\" id=aTab>&nbsp;"+c_rgszSh[i]+"&nbsp;</a></td>";
        }
        szHTML+="<td id=tdTab height=1 nowrap class=\"clBorder\"><a id=aTab>&nbsp;</a></td><td width=100%></td>";
       } else if (iRow==2) {
        for (i=0;i<c_lTabs;i++)
         szHTML+="<td height=1></td><td height=1 class=\"clBorder\"></td>";
        szHTML+="<td height=1></td><td height=1></td>";
       } else if (iRow==3) {
        for (i=0;i<iCellCount;i++)
         szHTML+="<td height=1></td>";
       } else if (iRow==4) {
        for (i=0;i<c_lTabs;i++)
         szHTML+="<td height=1 width=1></td><td height=1></td>";
        szHTML+="<td height=1 width=1></td><td></td>";
       }
      }
      szHTML+="</tr>";
     }
    
     szHTML+="</table></body></html>";
     with (frames['frTabs'].document) {
      open("text/html","replace");
      charset=document.charset;
      write(szHTML);
      close();
     }
    }
    
    function fnInit()
    {
     g_rglTabX[0]=0;
     var i;
     for (i=1;i<=c_lTabs;i++)
      with (frames['frTabs'].document.all.tbTabs.rows[1].cells[fnTabToCol(i-1)])
       g_rglTabX[i]=offsetLeft+offsetWidth-6;
    }
    
    function fnTabToCol(iTab)
    {
     return 2*iTab+1;
    }
    
    function fnNextTab(fDir)
    {
     var iNextTab=-1;
     var i;
    
     with (frames['frTabs'].document.body) {
      if (fDir==0) {
       if (scrollLeft>0) {
        for (i=0;i<c_lTabs&&g_rglTabX[i]<scrollLeft;i++);
        if (i<c_lTabs)
         iNextTab=i-1;
       }
      } else {
       if (g_rglTabX[c_lTabs]+6>offsetWidth+scrollLeft) {
        for (i=0;i<c_lTabs&&g_rglTabX[i]<=scrollLeft;i++);
        if (i<c_lTabs)
         iNextTab=i;
       }
      }
     }
     return iNextTab;
    }
    
    function fnScrollTabs(fDir)
    {
     var iNextTab=fnNextTab(fDir);
    
     if (iNextTab>=0) {
      frames['frTabs'].scroll(g_rglTabX[iNextTab],0);
      return true;
     } else
      return false;
    }
    
    function fnFastScrollTabs(fDir)
    {
     if (c_lTabs>16)
      frames['frTabs'].scroll(g_rglTabX[fDir?c_lTabs-1:0],0);
     else
      if (fnScrollTabs(fDir)>0) window.setTimeout("fnFastScrollTabs("+fDir+");",5);
    }
    
    function fnSetTabProps(iTab,fActive)
    {
     var iCol=fnTabToCol(iTab);
     var i;
    
     if (iTab>=0) {
      with (frames['frTabs'].document.all) {
       with (tbTabs) {
        for (i=0;i<=4;i++) {
         with (rows[i]) {
          if (i==0)
           cells[iCol].style.background=c_rgszClr[fActive?0:2];
          else if (i>0 && i<4) {
           if (fActive) {
            cells[iCol-1].style.background=c_rgszClr[2];
            cells[iCol].style.background=c_rgszClr[0];
            cells[iCol+1].style.background=c_rgszClr[2];
           } else {
            if (i==1) {
             cells[iCol-1].style.background=c_rgszClr[2];
             cells[iCol].style.background=c_rgszClr[1];
             cells[iCol+1].style.background=c_rgszClr[2];
            } else {
             cells[iCol-1].style.background=c_rgszClr[4];
             cells[iCol].style.background=c_rgszClr[(i==2)?2:4];
             cells[iCol+1].style.background=c_rgszClr[4];
            }
           }
          } else
           cells[iCol].style.background=c_rgszClr[fActive?2:4];
         }
        }
       }
       with (aTab[iTab].style) {
        cursor=(fActive?"default":"hand");
        color=c_rgszClr[3];
       }
      }
     }
    }
    
    function fnMouseOverScroll(iCtl)
    {
     frames['frScroll'].document.all.tdScroll[iCtl].style.color=c_rgszClr[7];
    }
    
    function fnMouseOutScroll(iCtl)
    {
     frames['frScroll'].document.all.tdScroll[iCtl].style.color=c_rgszClr[6];
    }
    
    function fnMouseOverTab(iTab)
    {
     if (iTab!=g_iShCur) {
      var iCol=fnTabToCol(iTab);
      with (frames['frTabs'].document.all) {
       tdTab[iTab].style.background=c_rgszClr[5];
      }
     }
    }
    
    function fnMouseOutTab(iTab)
    {
     if (iTab>=0) {
      var elFrom=frames['frTabs'].event.srcElement;
      var elTo=frames['frTabs'].event.toElement;
    
      if ((!elTo) ||
       (elFrom.tagName==elTo.tagName) ||
       (elTo.tagName=="A" && elTo.parentElement!=elFrom) ||
       (elFrom.tagName=="A" && elFrom.parentElement!=elTo)) {
    
       if (iTab!=g_iShCur) {
        with (frames['frTabs'].document.all) {
         tdTab[iTab].style.background=c_rgszClr[1];
        }
       }
      }
     }
    }
    
    function fnSetActiveSheet(iSh)
    {
     if (iSh!=g_iShCur) {
      fnSetTabProps(g_iShCur,false);
      fnSetTabProps(iSh,true);
      g_iShCur=iSh;
     }
    }
    
     window.g_iIEVer=fnGetIEVer();
     if (window.g_iIEVer>=4)
      fnBuildFrameset();
    //-->
    </script>
    <![endif]><!--[if gte mso 9]><xml>
     <x:ExcelWorkbook>
      <x:ExcelWorksheets>
       <x:ExcelWorksheet>
        <x:Name>Data</x:Name>
        <x:WorksheetSource HRef="Kanban%20Demo_files/sheet001.htm"/>
       </x:ExcelWorksheet>
       <x:ExcelWorksheet>
        <x:Name>Kanban</x:Name>
        <x:WorksheetSource HRef="Kanban%20Demo_files/sheet002.htm"/>
       </x:ExcelWorksheet>
       <x:ExcelWorksheet>
        <x:Name>tmast_product</x:Name>
        <x:WorksheetSource HRef="Kanban%20Demo_files/sheet003.htm"/>
       </x:ExcelWorksheet>
       <x:ExcelWorksheet>
        <x:Name>WH</x:Name>
        <x:WorksheetSource HRef="Kanban%20Demo_files/sheet004.htm"/>
       </x:ExcelWorksheet>
       <x:ExcelWorksheet>
        <x:Name>Sloc</x:Name>
        <x:WorksheetSource HRef="Kanban%20Demo_files/sheet005.htm"/>
       </x:ExcelWorksheet>
      </x:ExcelWorksheets>
      <x:Stylesheet HRef="Kanban%20Demo_files/stylesheet.css"/>
      <x:WindowHeight>7545</x:WindowHeight>
      <x:WindowWidth>20490</x:WindowWidth>
      <x:WindowTopX>32767</x:WindowTopX>
      <x:WindowTopY>32767</x:WindowTopY>
      <x:ActiveSheet>4</x:ActiveSheet>
      <x:ProtectStructure>False</x:ProtectStructure>
      <x:ProtectWindows>False</x:ProtectWindows>
     </x:ExcelWorkbook>
    </xml><![endif]-->
    </head>
    
    <frameset rows="*,39" border=0 width=0 frameborder=no framespacing=0>
     <frame src="Kanban%20Demo_files/sheet005.htm" name="frSheet">
     <frame src="Kanban%20Demo_files/tabstrip.htm" name="frTabs" marginwidth=0 marginheight=0>
     <noframes>
      <body>
       <p>This page uses frames, but your browser doesn't support them.</p>
      </body>
     </noframes>
    </frameset>
    </html>
    
    `);
    printDocument.close();
    printWindow.print();
  };

  const handlePrint2 = () => {
      window.print(); // Memicu dialog pencetakan saat tombol diklik
 
  }

  return (
    <div className="container-fluid body-kanban"  style={{}}>
      <div className="row g-3">
        <div className=" col-12 ">
          <form onSubmit={handleCreateQrCode} className="row g-1">
            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  From
                </label>
                <div className="col-sm-8">
                  <div className="d-flex">
                    <Typeahead
                      options={slocs}
                      ref={refForm}
                      labelKey={'code'}
                      className="form-control border-0 form-control-sm p-0 "
                      placeholder="Sloc Code"
                      onChange={(e) =>
                        handleFilterProduct(
                          e[0] && e[0].code ? e[0].code : '',
                        ) &
                        setDataQrCode((prevData) => {
                          return {
                            ...prevData,
                            from: e[0] && e[0].code ? e[0].code : '',
                          };
                        })
                      }
                    />
                    <input
                      value={
                        dataQrCode.from
                          ? slocs.find(
                              (item) =>
                                String(item.code) === String(dataQrCode.from),
                            )?.name
                          : ''
                      }
                      disabled
                      type="Text"
                      className="form-control form-control-sm"
                      id=""
                      placeholder="Sloc Name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 ">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Part Code
                </label>
                <div className="col-sm-8">
                  <Typeahead
                    options={profuctFiltered}
                    ref={refPartCode}
                    labelKey={'part_code'}
                    disabled={!dataQrCode.from}
                    className="form-control border-0 form-control-sm p-0 "
                    placeholder="Part Code"
                    required
                    onChange={(e) =>
                      setDataQrCode((prevData) => {
                        return {
                          ...prevData,
                          part_code: e[0] && e[0].part_code ? e[0].part_code : '',
                          part_name:
                            e[0] && e[0].part_code
                              ? products.find(
                                  (item) =>
                                    parseInt(item.part_no) ===
                                    parseInt(e[0].part_code),
                                )?.part_name
                              : '',
                        };
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Part Name
                </label>
                <div className="col-sm-8">
                  <input
                    value={dataQrCode.part_name ? dataQrCode.part_name : ''}
                    onChange={(e) =>
                      setDataQrCode((prevData) => {
                        return { ...prevData, part_name: e.target.value };
                      })
                    }
                    disabled
                    className="form-control form-control-sm"
                    id=""
                    placeholder="Part Name"
                  />
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Qty
                </label>
                <div className="col-sm-8">
                  <div className="d-flex flex-column">
                    <div className="col-12 mb-2">
                      <span className=" fs-6">
                        Qty Available :
                        <span
                          className={`badge ${
                            !dataQrCode.part_code
                              ? 'bg-secondary'
                              : 'bg-success'
                          }  `}
                        >
                          {dataQrCode.part_code
                            ? warehouses.find(
                                (warehouse) =>
                                  parseInt(warehouse.part_code) ===
                                  parseInt(dataQrCode.part_code),
                              )?.qty
                            : '0'}
                        </span>
                      </span>
                    </div>
                    <input
                      value={dataQrCode.qty ? dataQrCode.qty : ''}
                      onChange={(e) =>
                        setDataQrCode((prevData) => {
                          return { ...prevData, qty: e.target.value };
                        })
                      }
                      required
                      disabled={!dataQrCode.part_code}
                      type="number"
                      max={
                        dataQrCode.part_code
                          ? warehouses.find(
                            (warehouse) =>
                              parseInt(warehouse.part_code) ===
                              parseInt(dataQrCode.part_code),
                          )?.qty
                          : '0'
                      }
                      className="form-control form-control-sm"
                      id=""
                      placeholder="Qty For Qr Code"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row ">
                <label
                  htmlFor=""
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  To
                </label>
                <div className="col-sm-8">
                  <div className="d-flex">
                    <Typeahead
                      options={slocs}
                      labelKey={'code'}
                      className="form-control border-0 form-control-sm p-0 "
                      placeholder="Sloc Code"
                      ref={refTo}
                      disabled={!dataQrCode.from}
                      onChange={(e) =>
                        setDataQrCode((prevData) => {
                          return {
                            ...prevData,
                            to: e[0] && e[0].code ? e[0].code : '',
                          };
                        })
                      }
                    />
                    <input
                      value={
                        dataQrCode.to
                          ? slocs.find(
                              (item) =>
                                String(item.code) === String(dataQrCode.to),
                            )?.name
                          : ''
                      }
                      disabled
                      type="Text"
                      className="form-control form-control-sm"
                      id=""
                      placeholder="Sloc Name"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-evenly">
                <span
                  onClick={handleClearFromQrCode}
                  className="btn col-sm-4 btn-danger text-white btn-sm"
                >
                  clear
                </span>
                <button
                  type="submit"
                  disabled={
                    !dataQrCode.part_name ||
                    !dataQrCode.part_code ||
                    !dataQrCode.qty ||
                    !dataQrCode.to ||
                    !dataQrCode.from
                  }
                  className="btn col-sm-4 btn-success text-white btn-sm"
                >
                  Create Qr Code
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="col-12">
          <hr />
          <div className="col-md-12">
            <div className="row">
              <div className="col-1  d-flex align-items-center justify-content-center ">
                <div className="col-3">
                  <div className="d-flex justify-content-center align-items-center ">
                    <span className="btn btn-warning fw-bold">
                      <CIcon icon={cilFilter} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-4 ms-auto">
                <input
                  type="text"
                  value={search && search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control "
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
          <div className="table-responsive mt-2 bg-white mb-5" style={{height: "50vh"}}>
            <table className="table table-sm text-center align-middle">
              <thead>
                <tr className="text-center">
                  <th scope="col">No</th>
                  <th scope="col">Part Name</th>
                  <th scope="col">Part No</th>
                  <th scope="col">qty</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {kanbans.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.part_name} </td>
                    <td>{item.part_code} </td>
                    <td>{item.qty} </td>
                    <td>{item.from} </td>
                    <td>{item.to} </td>

                    <td style={{ width: '150px' }}>
                      <span
                        /* onClick={() => handleDeleteSloc(item.id)} */ className="btn btn-danger text-white"
                      >
                        <CIcon icon={cilTrash} />
                      </span>
                      <span
                        data-bs-toggle="modal"
                        data-bs-target="#detailKanban"
                        onClick={() => handlePreviewKanban(item)}
                        className="btn btn-success text-white ms-3"
                      >
                        <CIcon icon={cilCheck} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="detailKanban"
        tabIndex="-1"
        aria-labelledby="detailKanbanLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="detailKanbanLabel">
                Preview Kanban
              </h1>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* start kanban */}
                <div   className="col-5" >
                  <div  className=" d-flex print-content  border border-3 p-2 ">
                    <div className="text-start col-6 justify-content-evenly" ref={kanbanRef}>
                      <ul className='text-decoration-none'>
                        <li>Part No : {kanbanById.part_code} </li>
                        <li>Part Name : {kanbanById.part_name} </li>
                        <li>Qty : {kanbanById.qty} </li>
                        <li>From : {kanbanById.from} </li>
                        <li>To : {kanbanById.to} </li>
                      </ul>
                    </div>
                    <div
                      className="border border-dark border-5  col-6 "
                      style={{ height: '150px', width: '150px', margin :'0px', padding : '10px',  }}
                      ref={qrCodeRef}

                     
                    >
                      {qrValue && (
                        <QRCodeSVG
                          value={qrValue}
                          style={{width : '100%', height : '100%', padding : "0px", margin : '0px'}}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* end kanban */}

                {/* start button print kanban */}
                <div className='col-4'>
                    <div className='d-flex'>
                        <button onClick={handlePrint} className='btn btn-success text-white'>Print Kanban</button>
                    </div>
          
                </div>
                {/* end button print kanban */}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger text-white"
                data-bs-dismiss="modal"
                onClick={handleClosePreviewKanban}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MasterKanban;
