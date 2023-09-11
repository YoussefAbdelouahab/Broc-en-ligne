import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/navbar-principal/Navbar";
import rgpd from "../../assets/RGPD.png";

import "./Politiques.scss"

export default function Home() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <div className="container">
                    <div className="rgpd-head">
                        <h1>Politique de confidentialité</h1><br></br>
                        <h2>Date de mise à jour : 26 juin 2023</h2><br></br>
                        <p>Chez Broc en ligne, nous attachons une grande importance à la protection de votre vie privée et nous sommes soucieux de
                            préserver la confidentialité des informations personnelles que vous nous transmettez lors de l’utilisation de notre reactapp suInternet. C’est la raison pour laquelle nous avons rédigé ce document (ci-après la « Politique de Confidentialité » ou les « Règlesde Confidentialité »). Il s’applique à tous les Utilisateurs de notre reactapp<br></br><br></br>
                            Nous vous invitons à lire avec attention notre Politique de Confidentialité et à nous contacter pour toute question sur la collectet le traitement de vos Données Personnelles à l’adresse email suivante : contact@brocenligne.fr<br></br><br></br>
                            Sachez enfin que la Politique de Confidentialité fait partie intégrante des Conditions générales d’utilisation et qu’à ce titre cesdocuments doivent être lus ensemble.
                        </p>
                    </div>
                    <div className="rgpd-body">
                        <h3><strong>1 Champ d'application</strong></h3>
                        <p>
                            Le traitement de vos Données Personnelles est soumis à la loi française, notamment à la loi n° 78-17 du 6 janvier 1978 relative
                            l’informatique, aux fichiers et aux libertés (dite Loi Informatique et Libertés) ainsi qu’au Règlement UE 2016/679 du 27 avril
                            2016, dit Règlement Général sur la Protection des Données (RGPD).<br></br><br></br>
                            Conformément à la législation en vigueur, la Politique de Confidentialité détaille les Données Personnelles collectées et traitéeslors de l’utilisation de notre Webb App, les raisons du traitement des Données Personnelles des Utilisateurs, la manière dont
                            Brocenligne les utilise et les droits des Utilisateurs quant à leurs Données Personnelles.<br></br><br></br>
                            Une Donnée Personnelle se définit comme toute information se rapportant à une personne physique qui peut être identifiée
                            directement ou indirectement. Ce sont par exemple : le nom, prénom, adresse email et postale d’une personne physique, son
                            image sur une photographie ou une vidéo, une adresse IP, une donnée de localisation, etc..

                        </p>
                        <h3><strong>2 Acceptation et mise à jour de nos Règles de Confidentialité</strong></h3>
                        <p>
                            En vous inscrivant par email, vous confirmez avoir pris connaissance et accepter la présente Politique de Confidentialité, partieintégrante des Conditions Générales d’Utilisation. En cas de désaccord avec l’une ou plusieurs de ses conditions, l’Utilisateur estlibre de ne pas ou ne plus utiliser nos services (notamment en cas de modification des termes de la Politique).<br></br><br></br>
                            Les présentes Règles de Confidentialité peuvent être amenées à changer, étant précisé que toute diminution de vos droits ne
                            saurait être appliquée sans votre consentement. Brocenligne publiera les nouvelles versions de la Politique de Confidentialité
                            sur la webapp et à l’adresse suivante https://corporate.geev.com/politique-de-confidentialite/.<br></br><br></br>
                            D’une manière générale, la Politique de Confidentialité est toujours facilement accessible à cette même adresse.


                        </p>
                        <h3><strong>3 Responsable de traitement des Données Personnelles</strong></h3>
                        <p>
                            Selon la législation en vigueur,Brocenligne est le Responsable du traitement de vos Données Personnelles.<br></br><br></br>
                            En cette qualité, Brocenligne s’engage à respecter les dispositions légales et à effectuer un traitement licite, loyal et transparentdes Données Personnelles des Utilisateurs. Brocenligne garantit par ailleurs aux Utilisateurs que ce traitement s’inscrit dans le
                            cadre des finalités explicites et légitimes déterminées dans la Politique de Confidentialité. La durée de traitement n’excède pasla durée nécessaire aux finalités pour lesquelles les Données Personnelles sont collectées et traitées


                        </p>
                        <h3><strong>4 Catégories de Données Personnelles collectées et traitées lors de l’utilisation de la Webapp</strong></h3>
                        <p>
                            a) Quelles sont les Données Personnelles collectées et comment sont-elles traitées ?
                            Afin de fournir un accès à la Plateforme et à ses Services, Brocenligne est susceptible de collecter plusieurs catégories de
                            Données Personnelles vous concernant, pour des finalités, des bases légales de traitement et des durées de conservation
                            différentes.<br></br><br></br>
                            Nous vous proposons une synthèse de l’ensemble de ces informations dans le tableau ci-dessous.
                            Si vous souhaitez en savoir un peu plus sur les Données collectées et les finalités de traitement vous pouvez également lire les
                            précisions en-dessous du tableau.
                        </p>
                        <img src={rgpd} alt="" />

                        <h4>Précisions sur les Données Personnelle collectées</h4>
                        <p>Broc en ligne collecte deux types de Données différentes ci-après détaillées.</p>

                        <h4>Les Données que vous nous transmettez</h4>
                        <p>Données de profil : Ce sont les Données que vous devez obligatoirement renseignez à l’ouverture de votre compte : nom ou
                            prénom, adresse email, mot de passe, sexe.<br></br><br></br>
                            Communications avec Brocenligne: lorsque vous nous signalez un problème sur la react app (annonces inappropriés, bugs,
                            erreurs), que vous répondez à un sondage sur la qualité de nos Services, que vous demandez de l’assistance ou faites une
                            demande d’exercice de vos droits nous enregistrons les informations que vous acceptez de nous communiquer ou celles
                            dont nous avons besoin pour répondre à votre demande.
                        </p>

                        <h4>Les Données que nous collectons lorsque vous utilisez nos Services</h4>
                        <p>Données relatives à votre activité sur Brocenligne : ce sont notamment :</p>
                        <ul>
                            <li>les Données de connexion : adresse IP, date d’inscription, date de votre dernière connexion</li>
                            <li>les Données relatives à la façon dont vous utilisez nos Services : le nombre d'articles de vous déposés, le nombre
                                d'articles bien vendu, le nombre de rendez-vous honorés et manqués, les annonces que vous consultez, le nombre de
                                fois qu’une annonce a été consultée.</li>
                        </ul>

                        <h4>Données relatives aux annonces :</h4>
                        <p>Ces données concernent les photos et les descriptions des annonces que vous publiez
                            sur Brocenligne. Notez que les Utilisateurs qui consultent vos annonces peuvent toujours en faire une copie ou une capture
                            d’écran. Aussi, afin de protéger votre vie privée nous vous recommandons vivement d’éviter de publier des photographies
                            contenant des informations pouvant être utilisées à mauvais escient comme une plaque d’immatriculation.
                        </p>

                        <h4>Données relatives aux appareils et équipements utilisés :</h4>
                        <p>Nous collectons des informations sur, et émises par, les appareils et équipements que vous utilisez pour accéder à
                            Brocenligne. Il s’agit notamment de votre adresse IP ou MAC, du type de navigateur utilisé, de l’identifiant de publicité (AAID
                            pour Google et IDFA pour Apple), des pannes de l’application, du type d’appareil, de la version du système d’exploitation, du
                            langage sélectionné.<br></br><br></br>
                            Appareils photo et photos : nos Services nécessitent que vous nous autorisiez à collecter des Données provenant de
                            l’appareil photo et de la bibliothèque photos de votre téléphone (à des fins de complétion de votre profil utilisateur et de
                            publication d’annonces). Si vous refusez de nous permettre d’accéder à votre la caméra de votre téléphone ou à votre
                            bibliothèque photos, vous pourrez consulter les annonces des autres Utilisateurs mais vous ne pourrez pas créer de
                            compte utilisateur ou publier d’annonce..
                        </p>

                        <h4>Données marketing :</h4>
                        <p>Sous réserve de votre consentement nous sommes susceptibles de collecter les données concernant vos centres d’intérêts etvos préférences.</p>

                        <h4>A) Précisions sur les bases légales et les finalités de traitement</h4>
                        <p>Nous traitons les Données ci-dessus décrites conformément aux exigences du RGPD pour différentes finalités sur les bases
                            de l’exécution contractuelle lorsque le traitement nous permet de fournir les Services tels que décrits dans les Conditions
                            Générales d’Utilisation.<br></br><br></br>
                            Cela inclut :
                        </p>
                        <ul>
                            <li>Le bon fonctionnement de react app</li>
                            <li>L’administration de la react app, la réparation et la correction de bugs, les mises à jour</li>
                            <li>La vérification de la compatibilité des modalités de présentation du contenu au regard du type d’appareil utilisé</li>
                            <li>L’envoi de message d’information concernant les changements apportés à nos services</li>
                            <li>L’accès à la webapp et aux services connexes (inscription sur brocenligne,gestion, publication, partage des annonces, interaction avec d’autres utilisateurs)</li>
                            <li>Les services d’assistance Utilisateurs</li>
                            <li>Nos intérêts légitimes lorsque le traitement nous permet de vous proposer une react app efficace et dynamique</li>
                            <li>La vérification de la stabilité et de la sécurité de la react app</li>
                            <li>Le contrôle des annonces des Utilisateurs, de leurs messages et métadonnées associées à des fins administratives et de vérification de leur conformité à nos Conditions Générales d’Utilisation</li>
                            <li>La compréhension des modalités d’utilisation de l’Application et du Site Internet par les Utilisateurs à des fins d’amélioration, de développement de la Plateforme</li>
                            <li>L’envoi de sondages et de demandes de feedback dans le but d’améliorer les services offerts</li>
                            <li>Nos obligations légales lorsque le traitement de Données vise à identifier, prévenir et lutter contre les activités abusives, frauduleuses, et illégales</li>
                            <li>Votre consentement lorsque le traitement porte sur des données optionnelles de profils, des données de géolocalisation, ou qu’il a pour objectif de vous proposer des contenus publicitaires personnalisés ou de vous permettre de partager vos annonces et/ou celles d’un autre Utilisateur sur une autre plateforme (comme Facebook ou Twitter)</li>
                        </ul>

                        <h4>B) Cookies</h4>
                        <p>Un « cookie » (ou « traceur » ou tout autre technologie équivalente) est un témoin de connexion qui désigne un
                            fichier texte susceptible d’être enregistré dans un espace dédié du disque dur de votre terminal (ordinateur,
                            tablette, ou smartphone), à l’occasion de la consultation d’un service accessible en ligne. Un cookie permet à
                            son émetteur d’identifier le terminal dans lequel il est enregistré, pendant la durée de validité ou
                            d’enregistrement du cookie. Le cookie ne permet donc pas d’identifier l’Utilisateur en tant que tel ; il sert à
                            enregistrer vos informations de navigation sur la Plateforme.<br></br><br></br>
                            Lorsque vous vous connectez sur react app, des informations relatives à votre navigation sont susceptibles
                            d’être enregistrées dans des fichiers « Cookies » (ou équivalent) installés sur votre terminal, selon les choix que
                            vous avez pu exprimer concernant les cookies et qui restent modifiables à tout moment. Ces cookies
                            permettent une navigation personnalisée et sont également utilisés à des fins analytiques (mesures
                            d’audience)<br></br><br></br>
                            L’existence des cookies et leur(s) finalité(s) vous seront indiquées dès votre connexion à la webapp, par la
                            présence d’un bandeau d’information apparaissant dans une fenêtre pop-up.
                            Le dépôt et la lecture des cookies sur votre terminal nécessitent votre consentement préalable, recueilli par un
                            clic sur « Accepter & Fermer » ou « Tout accepter ». L’accord donné pour l’utilisation de cookies a une durée de
                            validité de 13 mois. Passé ce délai nous vous demanderons de renouveler votre accord.
                            En cas de refus des cookies, ou de suppression de ceux qui sont enregistrés, l’Utilisateur est informé qu’il ne
                            pourra plus bénéficier d’un certain nombre de fonctionnalités qui sont néanmoins nécessaires pour naviguer
                            dans certains espaces de l’Application ou du Site Internet. Le cas échéant, Brocenligne décline toute
                            responsabilité pour les conséquences liées au fonctionnement dégradé de ses Prestations résultant de
                            l’impossibilité pour Brocenligne d’enregistrer ou de consulter les cookies nécessaires au bon fonctionnement
                            de l’Application et du Site Internet et que vous auriez refusés ou supprimés.
                            Enfin, il convient de distinguer les cookies émis sur l’Application et le Site Internet de ceux émis par des tiers. A
                            ce titre, nous vous informons que des cookies peuvent être placés de temps à autres sur certaines pages de
                            l’Application ou du Site Internet par des tiers (annonceurs publicitaires ou autres). C’est le cas par exemple pour
                            les cookies du réseau social Facebook. Nous vous informons par ailleurs que Brocenligne n’exerce aucun
                            contrôle sur l’utilisation de cookies par les tiers.
                            Vos choix en matière de cookies sont consultables et accessibles à tout moment dans la rubrique « Cookies »
                            présente en bas de page de notre site internet ou dans la section « Confidentialité » de notre application
                        </p>

                        <h3><strong>5 Conditions d’utilisation des Données Personnelles</strong></h3>
                        <p>
                            Toute utilisation de Données Personnelles dans un but autre que ceux exposés ci-dessus dans nos Règles de
                            Confidentialité nécessitera l’accord préalable exprès de l’Utilisateur.
                            Brocenligne s’engage à conserver les Données Personnelles des Utilisateurs uniquement pendant la durée
                            strictement nécessaire au(x) traitement(s) déclaré(s) selon les finalités précitées ou à l’exercice et à la
                            constatation de ses droits en justice, et en toute hypothèse dans les limites imposées par la loi.
                            Brocenligne s’engage à effacer les Données Personnelles de ses bases de données à l’issue de ces différentes
                            durées.
                        </p>
                        <h4>Partage d’informations avec des tiers</h4>
                        <p>Vos informations et Données Personnelles peuvent, le cas échéant, être transmises à des tiers sous-traitants
                            intervenant dans la fourniture des Services (prestataires techniques et d’hébergement, envoi de notifications,
                            publication et partage des annonces, suivi Utilisateur et enquêtes de satisfaction, gestion d’incident de sécurité
                            ou activité frauduleuse, etc.).
                            Brocenligne s’engage à ne communiquer les Données Personnelles des Utilisateurs qu’à des prestataires
                            habilités et de confiance, qui les traitent pour notre compte, selon nos instructions, conformément aux
                            présentes Règles de Confidentialité et dans le respect de toute autre mesure appropriée de sécurité et de
                            confidentialité.
                            Ces prestataires ont un accès limité aux données strictement nécessaires pour accomplir les tâches pour le
                            compte de Brocenligne. Ils sont par ailleurs contraints contractuellement de les protéger et de les utiliser
                            uniquement aux fins pour lesquelles elles ont été communiquées et conformément à la présente Politique de
                            Confidentialité.<br></br><br></br>
                            Si vous l’avez autorisé, certaines données personnelles collectées peuvent être transmises à des tiers à des fins de
                            personnalisation des publicités et de marketing ciblé, conformément aux finalités énoncées ci-dessus.<br></br><br></br>
                            Le traitement des Données Personnelles dans les conditions décrites dans les Règles de Confidentialité implique parfois de
                            transférer vos Données dans un ou plusieurs autres pays, à l’intérieur ou à l’extérieur de l’Espace Economique Européen, et
                            notamment aux Etats-Unis.<br></br><br></br>
                            Le cas échéant nous utilisons les clauses contractuelles type et/ou tout autre mécanisme approuvé par la Commission
                            Européenne pour conserver un niveau de protection de vos Données Personnelles équivalent à celui garanti par le RGPD.
                            Les informations et Données Personnelles pourront également être divulguées à un tiers si Geev y est contraint par la loi,
                            une disposition réglementaire, ou une ordonnance judiciaire, ou encore si cette divulgation est rendue nécessaire pour les
                            besoins d’une enquête, injonction ou d’une procédure judiciaire, sur le territoire national ou à l’étranger.<br></br><br></br>
                            De même, Brocenligne peut être amené à partager les informations et Données Personnelles avec des entreprises, des
                            conseils ou des personnes tierces afin de :
                        </p>
                        <ul>
                            <li>
                                Faire appliquer la Politique de Confidentialité et les Conditions générales d’utilisation de l’Application en vigueur, y
                                compris pour constater d’éventuels manquements à ceux-ci.
                            </li>
                            <li>
                                Se prémunir contre toute atteinte aux droits, aux biens ou à la sécurité de ses utilisateurs, en application et dans le
                                respect de la loi.
                            </li>
                        </ul>

                        <h3><strong>6 Sécurité des Données Personnelles</strong></h3>
                        <ul>
                            <li>Nous mettons en œuvre des mesures techniques et organisationnelles, comme le chiffrement des Données ou la
                                restriction de leur accès au personnel autorisé, pour nous assurer que vos Données Personnelles sont traitées de
                                manière sécurisée dans le respect des Règles de Confidentialité.
                            </li>
                            <li>Cependant, la transmission d’informations via Internet comporte des risques irréductibles qui ne permettent pas de
                                garantir une parfaite sécurité des informations transmises via l’Application ou le Site Internet. En conséquence, toute
                                transmission de Données Personnelles est réalisée à vos propres risques.
                            </li>
                        </ul>
                        <p>
                            Respect des droits des Utilisateurs de l’Application
                            Vous disposez de certains droits sur vos Données Personnelles dont voici la liste :<br></br><br></br>
                            1. Droit d’accès: il vous permet d’accéder gratuitement aux Données Personnelles collectées à votre égard.<br></br>
                            2. Droit de rectification: il vous permet de mettre à jour ou de corriger l’exactitude de vos Données.<br></br>
                            3. Droit de suppression : il peut être exercé lorsque le traitement des Données Personnelles n’est plus nécessaire au regard
                            des finalités pour lesquelles elles ont été collectées ou, le cas échéant, lorsque vous retirerez votre consentement au
                            traitement
                        </p>

                        <h3><strong>7 Droit d’opposition à la collecte et au traitement de tout ou partie de vos Données Personnelles :</strong></h3>
                        <p>
                            Ce droit n’est pas absolu et ne s’applique qu’aux Données Personnelles collectées à des fins de prospection commerciale, y
                            compris de profilage lorsqu’il est lié à des activités de prospection commerciale. Lorsque vous choisissez de vous opposer à
                            un tel traitement, nous vous demandons de nous indiquer les raisons de votre opposition afin de nous permettre de mettre
                            en balance nos intérêts légitimes avec votre demande.<br></br><br></br>
                            Droit de limitation du traitement des Données Personnelles. Ce droit n’est pas absolu, et ne peut s’appliquer que lorsque :
                            une demande de rectification a été effectuée en vertu du droit de rectification décrit au 8.2. Vous pouvez alors demander
                            l’arrêt du traitement de vos Données Personnelles pendant la durée nécessaire à la vérification de l’exactitude des
                            rectifications demandées.
                            vous souhaitez vous opposez à l’effacement de vos Données Personnelles dont le traitement était illicite ;
                            Brocenligne n’a plus besoin des Données Personnelles conformément aux finalités de traitement mais celles-ci vous sont
                            encore nécessaires pour la constatation, l’exercice ou la défense de droits en justice ;
                            Vous souhaitez faire usage de votre droit d’opposition décrit au 8.4. Vous pouvez alors demander l’arrêt du traitement de vosDonnées Personnelles pendant la durée nécessaire à la mise en balance de nos intérêts légitimes avec votre demande.
                            En cas d’exercice des droits ci-dessus auprès de Brocenligne la société Geev fournit une copie des données à caractère
                            personnel faisant l’objet d’un traitement et peut exiger le paiement de frais raisonnables basés sur les coûts administratifs
                            pour toute copie supplémentaire demandée par l’intéressé.
                            Les demandes de mise en œuvre de ces droits devront être transmises à la société Geev à l’adresse email :
                            privacy@geev.com, accompagnées d’un justificatif d’identité en cas de doute raisonnable sur l’identité de la personne
                            souhaitant exercer ses droits.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
