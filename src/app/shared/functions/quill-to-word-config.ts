export const QUILLTOWORDCONFIG = {
  paragraphStyles: {
    normal: {
      paragraph: {
        spacing: {
          line: 276,
          before: 0,
          after:0
        }
      },
      run: {
        size: 24
      }
    },
    header_1: {
      run: {
        font: 'Calibri',
        size: 30,
        bold: true
      },
      paragraph: {
        spacing: {
          before: 300,
          after: 200
        }
      }
    },
    header_2: {
      run: {
        font: 'Calibri',
        size: 26,
        bold: true
      },
      paragraph: {
        spacing: {
          before: 200,
          after: 100
        }
      }
    },
    list_paragraph: {
      run: {
        size: 24
      }
    },
    block_quote: {
      run: {
        italics: true
      },
      paragraph: {
        indent: { left: 440 },
      }
    },
    citation: {
      run: {
        size: 24
      },
      paragraph: {
        indent: {
          left: 0,
          hanging: 320
        },
        spacing: {
          line: 380
        }
      }
    },
    code_block: {
      run: {
        size: 14,
        font: 'Courier New'
      },
      paragraph: {
        indent: { left: 720, right: 720 }
      }
    }
  },
  exportAs: 'blob'
};
