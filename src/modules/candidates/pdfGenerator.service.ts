import PDFDocument from 'pdfkit';
import { CandidateProfile, User, WorkExperience, Education } from '@prisma/client';

type FullProfile = CandidateProfile & {
  user: User;
  workExperiences: WorkExperience[];
  educations: Education[];
};

export const generateResumePdfService = (profile: FullProfile): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Colors & Fonts
      const primaryColor = '#2563EB'; // blue-600
      const textColor = '#1E293B'; // slate-800
      const lightText = '#64748B'; // slate-500

      // --- Header ---
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .fillColor(primaryColor)
        .text(`${profile.user.firstName || ''} ${profile.user.lastName || ''}`.trim() || 'Candidate Resume');

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(lightText)
        .moveDown(0.5);

      const contactInfo = [
        profile.user.email,
        profile.mobileNumber,
        profile.city,
      ].filter(Boolean).join('  |  ');
      
      doc.text(contactInfo);
      doc.moveDown(1.5);

      // --- About Me ---
      if (profile.aboutMe) {
        doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('Professional Summary');
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(profile.aboutMe, { align: 'justify' });
        doc.moveDown(1.5);
      }

      // --- Work Experience ---
      if (profile.workExperiences && profile.workExperiences.length > 0) {
        doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('Work Experience');
        doc.moveDown(0.5);

        profile.workExperiences.forEach(we => {
          doc.font('Helvetica-Bold').fontSize(11).fillColor(textColor).text(we.title);
          doc.font('Helvetica-Oblique').fontSize(10).fillColor(lightText).text(we.company);
          
          const start = we.startDate ? new Date(we.startDate).toLocaleDateString() : '';
          const end = we.isCurrent ? 'Present' : (we.endDate ? new Date(we.endDate).toLocaleDateString() : '');
          doc.font('Helvetica').fontSize(9).text(`${start} - ${end}`);
          
          doc.moveDown(0.5);
        });
        doc.moveDown(1);
      }

      // --- Education ---
      if (profile.educations && profile.educations.length > 0) {
        doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('Education');
        doc.moveDown(0.5);

        profile.educations.forEach(ed => {
          doc.font('Helvetica-Bold').fontSize(11).fillColor(textColor).text(`${ed.degree} ${ed.fieldOfStudy ? `in ${ed.fieldOfStudy}` : ''}`);
          doc.font('Helvetica-Oblique').fontSize(10).fillColor(lightText).text(ed.institution);
          
          const start = ed.startDate ? new Date(ed.startDate).toLocaleDateString() : '';
          const end = ed.isCurrent ? 'Present' : (ed.endDate ? new Date(ed.endDate).toLocaleDateString() : '');
          doc.font('Helvetica').fontSize(9).text(`${start} - ${end}`);
          
          doc.moveDown(0.5);
        });
        doc.moveDown(1);
      }

      // --- Skills ---
      if (profile.skills && profile.skills.length > 0) {
        doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('Skills');
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(profile.skills.join(', '));
        doc.moveDown(1.5);
      }

      // --- Languages ---
      if (profile.languages && profile.languages.length > 0) {
        doc.font('Helvetica-Bold').fontSize(14).fillColor(primaryColor).text('Languages');
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10).fillColor(textColor).text(profile.languages.join(', '));
        doc.moveDown(1.5);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
