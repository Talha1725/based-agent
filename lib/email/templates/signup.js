export const signupResetPasswordTemplate = (email, code, emailType) => {
  return `<html>
  <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100&display=swap"
      rel="stylesheet"
    />

    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        width: 100%;
        background-color: #f4f4f4;
      }

      .nl-container {
        background-color: #fffcfc;
        border: 10px solid #1a1a1a;
        width: 100%;
        max-width: 600px;
        margin: 0 auto; /* Center the table */
      }

      .row-content {
        background-color: #fffcfc;
        color: #000000;
        width: 100%;
        text-align: center !important;
      }

      h1 {
        color: #b29a76;
        font-size: 25px;
        font-family: "Monorama", "sans-serif", "JetBrains Mono", "monospace";
        font-weight: 700;
        text-align: center;
        margin: 0;
      }

      p {
        font-size: 21px;
        font-family: "Monorama", "sans-serif", "JetBrains Mono", "monospace";
        line-height: 150%;
        margin: 0;
      }

      a {
        text-decoration: none;
        color: white;
      }

      .button_block {
        text-align: center;
      }

      .button_block a {
        display: inline-block;
        background-color: #1a1a1a;
        color: #ffffff;
        padding: 10px 20px;
        font-size: 20px;
        font-family: "Monorama", "sans-serif", "JetBrains Mono", "monospace";
      }

      @media (max-width: 620px) {
        .row-content {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body>
    <table
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      align="center"
    >
      <tbody>
        <tr>
          <td>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-1"
              role="presentation"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      width="600"
                    >
                      <tbody>
                        <tr>
                          <td class="column column-1">
                            <table
                              border="0"
                              cellpadding="15"
                              cellspacing="0"
                              class="image_block block-1"
                              width="100%"
                            >
                              <tr>
                                <td>
                                  <div align="center">
                                    <img
                                      src="https://basedagents.co/new-navbar-logo.png"
                                      width="100"
                                      style="display: block; width: 100px"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td class="column column-1">
                            <table border="0" width="100%">
                              <tr>
                                <td style="padding: 15px">
                                  <p style="text-align: center;">
                                    Thank you for Signing up with Based Agent.
                                    Please enter this code to verify your
                                    registration with
                                    <strong>BasedAgent</strong>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td class="column column-1">
                            <div class="button_block">
                              <a href="#">${code}</a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="column column-1">
                            <table
                              align="center"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="row row-4"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tbody>
                                <tr>
                                  <td>
                                    <table
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="row-content stack"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        background-color: #fffcfc;
                                        color: #000000;
                                        border-radius: 0;
                                        width: 600px;
                                      "
                                      width="600"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            class="column column-1"
                                            style="
                                              mso-table-lspace: 0pt;
                                              mso-table-rspace: 0pt;
                                              font-weight: 400;
                                              text-align: center;
                                              vertical-align: top;
                                              padding-top: 5px;
                                              padding-bottom: 5px;
                                              border-top: 0px;
                                              border-right: 0px;
                                              border-bottom: 0px;
                                              border-left: 0px;
                                            "
                                            width="100%"
                                          >
                                            <table
                                              border="0"
                                              cellpadding="15"
                                              cellspacing="0"
                                              class="paragraph_block block-2"
                                              role="presentation"
                                              style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                              "
                                              width="100%"
                                            >
                                              <tr>
                                                <td class="pad">
                                                  <div
                                                    style="
                                                      color: #000000;
                                                      font-size: 16px;
                                                      font-family: 'Monorama',
                                                        'sans-serif',
                                                        'JetBrains Mono',
                                                        'monospace';
                                                      font-weight: 700;
                                                      text-align: center;
                                                      direction: ltr;
                                                      letter-spacing: 0px;
                                                      mso-line-height-alt: 24px;
                                                    "
                                                  >
                                                    If you didn't create an
                                                    account with us, please
                                                    ignore this email.
                                                  </div>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

`;
};
