declare module 'html2pdf.js' {
  interface Options {
    margin?: number | number[] | string;
    filename?: string;
    image?: { type: string; quality: number };
    html2canvas?: {
      scale: number;
      logging: boolean;
      dpi: number;
      letterRendering: boolean;
    };
    jsPDF?: { unit: string; format: string; orientation: string };
    pagebreak?: {
      mode: string[] | string;
      before?: string | string[];
      after?: string | string[];
      avoid?: string | string[];
    };
  }

  interface Html2Pdf {
    get(arg0: string): unknown;
    output(arg0: string): Promise<any>;
    set(opt: Options): Html2Pdf;
    from(element: Element | string): Html2Pdf;
    toPdf(): Html2Pdf;
    save(filename?: string): Promise<void>;
  }

  function html2pdf(): Html2Pdf;
  export = html2pdf;
}
