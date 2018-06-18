const pdf = require('pdfkit');
const fs = require('fs');

var Pdfkit = function Pdfkit() {

    this.generatePDF = function(data) {
        return new Promise(function(resolve, reject) {
            try {
                var document = new pdf({
                    autoFirstPage: false
                });
                var date = new Date();
                var fileName = data.projectId + '.pdf';
                var client = data.Project.Client.name,
                    developer = data.Project.Developer.name,
                    agent = 'Hurify',
                    project = data.Project.projectName,
                    price = data.bidValue,
                    clientHURAddress = data.clientHURAddress,
                    developerHURAddress = data.developerHURAddress,
                    estimatedDays = data.estimatedDays,
                    filePath = './public/shared/platform/escrowPDF/' + fileName;

                    document.pipe(fs.createWriteStream(filePath))

                document.on('pageAdded', function() {
                    document.image('./public/shared/platform/img/HURFIY1.png', 10, 2, {
                        width: 50
                    })
                })

                document.addPage();

                document.font('Helvetica-Bold')
                    .fontSize(18)
                    .text("SOFTWARE ESCROW AGREEMENT", {
                        align: 'center',
                        underline: true
                    })
                document.moveDown()

                document.font('Helvetica-Bold')
                    .fontSize(12)
                    .text('THIS AGREEMENT ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica').text('effective as of ' + date.toDateString())

                document.moveDown()

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('BETWEEN:')

                document.moveDown()

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text(client + (' ("Client")'), {
                        align: 'center'
                    })


                document.moveDown()

                document.font('Helvetica')
                    .fontSize(14)
                    .text('THE FIRST PARTY,', {
                        align: 'right'
                    })

                document.moveDown()

                document.font('Helvetica')
                    .fontSize(14)
                    .text('--AND--,', {
                        align: 'center'
                    })

                document.moveDown()

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text(developer + (' ("Developer")'), {
                        align: 'center'
                    })

                document.moveDown()

                document.font('Helvetica')
                    .fontSize(14)
                    .text('THE SECOND PARTY,', {
                        align: 'right'
                    })

                document.moveDown()

                document.font('Helvetica')
                    .fontSize(14)
                    .text('--AND--,', {
                        align: 'center'
                    })

                document.moveDown()

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text(agent + (' ("Escrow Agent")'), {
                        align: 'center'
                    })

                document.font('Helvetica')
                    .fontSize(14)
                    .text('a corporation incorporated under the laws of the Province of X,', {
                        align: 'center'
                    })

                document.moveDown()

                document.font('Helvetica')
                    .fontSize(14)
                    .text('THE THIRD PARTY,', {
                        align: 'right'
                    })

                document.moveDown()

                document.font('Helvetica')
                    .fontSize(14)
                    .text('for the project, titled as: ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica-Bold').text(project + ',')

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('whose project value is : ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica-Bold').text(price + ' HUR,')

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('for client wallet address : ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica-Bold').text(clientHURAddress);

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('for developer wallet address : ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica-Bold').text(developerHURAddress);

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('and the time frame : ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica-Bold').text(estimatedDays + ' days');

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('WHEREAS ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica').text('Developer has entered into a license agreement dated ______ (the “License”) with Licensee wherein Developer has licensed the use of certain materials and proprietary software (the “Materials”) in connection with the development and production of an interactive web-based new media project tentatively entitled ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica-Bold').text('"' + project + '" ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica').text(' and')

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('WHEREAS ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica').text('Developer wishes to protect the confidentiality of its Materials while providing Licensee with access to the Materials in the event that certain circumstances described in this Agreement occur and')

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('WHEREAS ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica').text('Developer wishes to deposit such Materials in escrow to be held by Escrow Agent in accordance with the terms and conditions of this Agreement')

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('NOW THEREFORE THIS AGREEMENT WITNESSES ', {
                        align: 'justify',
                        continued: true
                    }).font('Helvetica').text('that in consideration of the premises, mutual covenants and agreements herein and other good and valuable consideration, the sufficiency of which is hereby acknowledged, the parties agree as follows:')

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('1.   Appointment of Escrow Agent and Escrow Fees')

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('(a) Developer and Licensee hereby appoints Escrow Agent to hold the Materials as defined herein in accordance with the terms and conditions of this Agreement and Escrow Agent agrees to act in such capacity.')

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('(b) In consideration for the services to be performed hereunder, Developer shall pay to Escrow Agent a monthly escrow fee of $[X] dollars. In the event of non-payment of escrow fees, Escrow Agent will give Developer and Licensee sixty (60) days notice of default. In the event that the sixty (60) day notice period elapses without Escrow Agent having received payment, Escrow Agent shall have the right, without further notice being required and without any liability to any party whatsoever, to terminate this Agreement and destroy the Materials or, at the request of the Licensee, release and deliver the Materials to the Licensee.')

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('2.   Term of this Agreement')

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('(a) The term of this Agreement shall commence on the date of this Agreement and shall continue in full force and effect so long as the License remains in full force and effect, unless this Agreement is terminated as hereinafter set out.')

                document.moveDown();

                document.font('Helvetica-Bold')
                    .fontSize(14)
                    .text('3. Materials Deposited in Escrow')

                document.moveDown();

                document.font('Helvetica')
                    .fontSize(14)
                    .text('(a) Developer agrees to deposit with Escrow Agent one copy of all the constituent elements of the proprietary software including but not limited to text, data, images, animation, graphics, video and audio segments and source and object code and user and system documentation of all software licensed to Licensee in connection with the Web Project (collectively, the “Materials”)')


                // Signature part
                document.font('Helvetica')
                    .fontSize(14)
                    .text(client, 20, 680);

                document.font('Helvetica')
                    .fontSize(14)
                    .text('(Client)', 60, 700);


                document.font('Helvetica')
                    .fontSize(14)
                    .text(developer, 20, 680, {
                        align: 'right'
                    });


                document.font('Helvetica')
                    .fontSize(14)
                    .text('(Developer)', 450, 700, {
                        align: 'justify'
                    });


                document.end();
                return resolve({
                    "success": true,
                    "fileName": fileName
                });
            } catch (err) {
                return reject(err);
            }
        })
    }

}
Pdfkit.instance = null;

Pdfkit.getInstance = function() {
    if (this.instance === null) {
        this.instance = new Pdfkit();
    }
    return this.instance;
}

module.exports = Pdfkit.getInstance();
