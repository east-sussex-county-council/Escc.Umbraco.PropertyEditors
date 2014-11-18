using Escc.Umbraco.PropertyEditors.RichTextPropertyValueConverter;
using NUnit.Framework;

namespace Escc.Umbraco.PropertyEditors.Tests
{
    [TestFixture]
    public class UseFormForEmailLinksFormatterTests
    {
        [Test]
        public void ConvertsAddressInHrefToForm()
        {
            const string before = "<a href=\"mailto:first.last@eastsussex.gov.uk\">real name</a>";
            const string after = "<a href=\"https://www.eastsussex.gov.uk/contactus/emailus/email.aspx?n=real+name&amp;e=first.last&amp;d=eastsussex.gov.uk\">real name</a>";

            var result = new UseFormForEmailLinksFormatter().Format(before);

            Assert.AreEqual(after, result);
        }

        [Test]
        public void LeavesEmailInLinkTextUnaltered()
        {
            const string before = "<a href=\"mailto:first.last@eastsussex.gov.uk\">first.last@eastsussex.gov.uk</a>";
            const string after = "<a href=\"https://www.eastsussex.gov.uk/contactus/emailus/email.aspx?n=First+Last&amp;e=first.last&amp;d=eastsussex.gov.uk\">first.last@eastsussex.gov.uk</a>";

            var result = new UseFormForEmailLinksFormatter().Format(before);

            Assert.AreEqual(after, result);
        }
    }
}
