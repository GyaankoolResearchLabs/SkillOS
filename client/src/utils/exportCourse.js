import jsPDF from "jspdf";

const exportCourse = (course) => {
  const doc = new jsPDF();

  let y = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text("SkillOS", 20, y);

  y += 12;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("AI Generated Training Course", 20, y);

  y += 18;

  doc.setFontSize(18);
  doc.text(course.courseTitle, 20, y);

  y += 10;

  doc.setFontSize(12);
  doc.text(course.description || "", 20, y);

  y += 15;

  doc.text(
    `Estimated Duration: ${course.estimatedDuration}`,
    20,
    y
  );

  y += 15;

  doc.setFontSize(16);
  doc.text("Modules", 20, y);

  y += 12;

  course.modules.forEach((module, index) => {
    doc.setFontSize(14);

    doc.text(
      `${index + 1}. ${module.title}`,
      20,
      y
    );

    y += 8;

    doc.setFontSize(11);

    doc.text(
      `Duration: ${module.duration}`,
      25,
      y
    );

    y += 8;

    module.learningObjectives.forEach((obj) => {
      doc.text(`• ${obj}`, 30, y);
      y += 7;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 8;
  });

  doc.save(`${course.courseTitle}.pdf`);
};

export default exportCourse;