using Escc.Umbraco.PropertyEditors.RichTextValueConverter;
using NUnit.Framework;

namespace Escc.Umbraco.PropertyEditors.Tests
{
    [TestFixture]
    class EncodeEmailAddressFormatterTests
    {
        [Test]
        public void EncodeEmailAddressWithinLink()
        {
            const string before = "<a href=\"http://www.example.org/\">first.last@eastsussex.gov.uk</a>";
            const string after = "<a href=\"http://www.example.org/\">&#0102;&#0105;&#0114;&#0115;&#0116;&#0046;&#0108;&#0097;&#0115;&#0116;&#0064;&#0101;&#0097;&#0115;&#0116;&#0115;&#0117;&#0115;&#0115;&#0101;&#0120;&#0046;&#0103;&#0111;&#0118;&#0046;&#0117;&#0107;</a>";

            var result = new EncodeEmailAddressFormatter().Format(before);

            Assert.AreEqual(after, result);
        }

        [Test]
        public void EncodeEmailAddressWithinText()
        {
            const string before = "You can send an email to anyone123@example-domain.anything at any time";
            const string after = "You can send an email to &#0097;&#0110;&#0121;&#0111;&#0110;&#0101;123&#0064;&#0101;&#0120;&#0097;&#0109;&#0112;&#0108;&#0101;-&#0100;&#0111;&#0109;&#0097;&#0105;&#0110;&#0046;&#0097;&#0110;&#0121;&#0116;&#0104;&#0105;&#0110;&#0103; at any time";

            var result = new EncodeEmailAddressFormatter().Format(before);

            Assert.AreEqual(after, result);
        }
    }
}
